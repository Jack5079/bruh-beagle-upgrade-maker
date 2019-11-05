let cost = document.getElementById('cost')
let code = document.getElementById('code')
let title = document.getElementById('name')
let desc = document.getElementById('desc')
let buy = document.getElementById('buy')

let editor = monaco.editor.create(document.getElementById("container"), {
  value: "// this code runs when the item is bought",
  language: "javascript",
  theme: 'vs-dark'
});

let display = monaco.editor.create(document.getElementById("display"), {
  language: "javascript",
  readOnly: true,
  theme: 'vs-dark'
});

editor.model.onDidChangeContent(update) // onchange


function update () {
  const settings = {
    name: title.textContent || 'Example title', // The <h2> in your upgrade.
    desc: desc.textContent || 'Example description', // The <p> below the name.
    startprice: parseInt(cost.innerText, 10) || 30
  }
  const text = `new class extends Upgrade { // All upgrades extend Upgrade.
    meta () { // Info about your upgrade.
      return ${JSON.stringify(settings, null, 4)}
    }
    ${editor.getValue().replace(/\s/g, '') ? `onbuy () { // When your upgrade is bought
      ${editor.getValue()}
    }` : ''}
  }`

  display.setValue(text)
}

document.querySelectorAll('[contenteditable]').forEach(e => e.addEventListener('keyup', update))




// the autocomplete
monaco.languages.registerCompletionItemProvider('javascript', {
  triggerCharacters: ['.'],
  // Function to generate autocompletion results
  provideCompletionItems: function (model, position, token) {
    const textUntilNow = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column })
    if (textUntilNow.endsWith('this.')) {
      return [{
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
      }]
    } else return new Array
  }
}
)
