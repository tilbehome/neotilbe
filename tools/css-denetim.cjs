// Read-only whole-sheet AST audit. Parser is an external tooling dependency,
// never a theme asset. CSS_TREE_PATH points to css-tree 3.1.0 dist/csstree.js.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.env.CSS_TREE_PATH, 'utf8'), context);
const css = context.csstree;
const file = process.argv[2] || 'canlitema/assets/style.css';
const source = fs.readFileSync(file, 'utf8');
const errors = [];
const ast = css.parse(source, { positions: true, onParseError: e => errors.push({line:e.line,message:e.message}) });
const valueWarnings = [];
css.walk(ast, {visit:'Declaration',enter(node) {
    if (node.property.startsWith('--') || /var\(/.test(css.generate(node.value))) return;
    const result = css.lexer.matchProperty(node.property,node.value);
    if (result.error) valueWarnings.push({line:node.loc.start.line,property:node.property,value:css.generate(node.value),message:result.error.message.split('\n')[0]});
}});
const rules = [], declarations = [], animations = [], atRules = [], redundant = [];
const scopeMaps = new Map();
function visit(container, scope) {
    const scopeKey = JSON.stringify(scope);
    if (!scopeMaps.has(scopeKey)) scopeMaps.set(scopeKey, [new Map(),new Map()]);
    const [previous,previousDeclarations] = scopeMaps.get(scopeKey);
    container.children?.forEach(node => {
        if (node.type === 'Atrule') {
            const name = '@' + node.name + ' ' + (node.prelude ? css.generate(node.prelude) : '');
            atRules.push({line:node.loc.start.line,name});
            if (/keyframes$/i.test(node.name)) animations.push(name);
            if (node.block) visit(node.block, scope.concat(name));
        }
        if (node.type !== 'Rule') return;
        const selector = css.generate(node.prelude);
        const body = css.generate(node.block);
        const key = selector + body;
        const item = {line:node.loc.start.line,endLine:node.loc.end.line,start:node.loc.start.offset,end:node.loc.end.offset,scope,selector,body,duplicateOf:null};
        if (previous.has(key)) previous.get(key).duplicateOf = item.line;
        previous.set(key,item);
        rules.push(item);
        node.block.children.forEach(d => {
            if (d.type === 'Declaration') {
                const decl = {line:d.loc.start.line,start:d.loc.start.offset,end:d.loc.end.offset,selector,scope,property:d.property,value:css.generate(d.value),important:!!d.important};
                declarations.push(decl);
                const signature = JSON.stringify([selector,decl.property,decl.value,decl.important]);
                if (previousDeclarations.has(signature)) redundant.push({...previousDeclarations.get(signature),retainedLine:decl.line});
                previousDeclarations.set(signature,decl);
            }
        });
    });
}
visit(ast, []);
const report = {file,bytes:Buffer.byteLength(source),sha256:crypto.createHash('sha256').update(source).digest('hex'),parser:'css-tree 3.1.0',errors,valueWarnings,rules:rules.length,declarations:declarations.length,exactDuplicates:rules.filter(r=>r.duplicateOf),redundant,important:declarations.filter(d=>d.important),variables:declarations.filter(d=>d.property.startsWith('--')),animations,atRules,allRules:rules};
fs.mkdirSync('artifacts/css-audit',{recursive:true});
fs.writeFileSync('artifacts/css-audit/'+file.replace(/[^a-zA-Z0-9._-]/g,'_')+'.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({file,bytes:report.bytes,rules:report.rules,errors,duplicates:report.exactDuplicates.length,redundant,important:report.important.length,animations,variables:report.variables},null,2));
