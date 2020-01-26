/* global monaco */
const cost = document.getElementById('cost')
const title = document.getElementById('name')
const desc = document.getElementById('desc')

const editor = monaco.editor.create(document.getElementById('container'), {
  value: '// this code runs when the item is bought',
  language: 'javascript',
  theme: 'vs-dark'
})

const display = monaco.editor.create(document.getElementById('display'), {
  language: 'javascript',
  readOnly: true,
  theme: 'vs-dark'
})

editor.model.onDidChangeContent(update) // onchange

function update () {
  const settings = {
    name: title.textContent || 'Example title', // The <h2> in your upgrade.
    desc: desc.textContent || 'Example description', // The <p> below the name.
    startprice: parseInt(cost.innerText, 10) || 30
  }
  const text = `import('./lib/upgrade.mjs').then(module=>{
    const up = new module.default(${JSON.stringify(settings, null, 4)})
    ${
      editor.getValue().replace(/\s/g, '')
        ? `up.addEventListener('buy', function () { // When your upgrade is bought
      ${editor.getValue()}
    }`
        : ''
    }
  }
  })`

  display.setValue(text)
}

document
  .querySelectorAll('[contenteditable]')
  .forEach(e => e.addEventListener('keyup', update))

// the autocomplete
monaco.languages.registerCompletionItemProvider('javascript', {
  triggerCharacters: ['.'],
  // Function to generate autocompletion results
  provideCompletionItems: function (model, position, token) {
    const textUntilNow = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    })
    if (textUntilNow.endsWith('this.')) {
      return [
        {
          label: 'price',
          kind: monaco.languages.CompletionItemKind.Property,
          detail: 'Number',
          documentation: 'The price of the upgrade. Defaults to 30.'
        },
        {
          label: 'html',
          kind: monaco.languages.CompletionItemKind.Property,
          detail: 'HTMLDivElement',
          documentation: 'The HTML <div> containing the upgrade.'
        },
        {
          label: 'hide',
          kind: monaco.languages.CompletionItemKind.Method,
          documentation: 'Hide the upgrade.'
        },
        {
          label: 'show',
          kind: monaco.languages.CompletionItemKind.Method,
          documentation: 'Show the upgrade.'
        }
      ]
    } else return []
  }
})
