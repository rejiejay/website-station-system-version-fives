import consequencer from './../utils/consequencer.js';

export const actionSheetPopUpUpDestroy = () => {
    const confirm = document.getElementById('rejiejay-action-sheet-popup')
    if (confirm) document.body.removeChild(confirm);
}

const props = {
    title: '',
    options: [{
        value: 1,
        label: 'name'
    }],
    handle: () => {}
}

export const actionSheetPopUp = ({ title, options, handle }) => new Promise(function(resolve, reject) {
    /** 目标: 防止重复调用 */
    if (document.getElementById('rejiejay-action-sheet-popup')) return false;

    const node = document.createElement("div");

    const selector = options.map(({ value, label }) =>
        `<div class='action-sheet-item flex-start-center'>${label}</div>`
    ).join('')

    const node_content = `
        <div id='rejiejay-action-sheet-popup-mask'></div>
        <div class='action-sheet-container'>
            <div class='action-sheet-title flex-center'>${title || 'please select item'}</div>
            <div class='action-sheet-selector'>${selector}</div>
        </div>
    `;

    node.setAttribute('class', 'rejiejay-action-sheet-popup');
    node.setAttribute('id', 'rejiejay-action-sheet-popup');
    node.innerHTML = node_content;
    document.body.appendChild(node);

    const children_dom = node.querySelectorAll('.action-sheet-item')
    for (let index = 0; index < children_dom.length; index++) {
        const element = children_dom[index];
        const targetItem = options[index];
        element.onclick = () => {
            handle ? handle(targetItem) : null;
            actionSheetPopUpUpDestroy()
            resolve()
        }
    }

    document.getElementById('ejiejay-action-sheet-popup-mask').onclick = function() {
        actionSheetPopUpUpDestroy()
        reject()
    }
}).then(
    () => consequencer.success(),
    error => consequencer.error(error)
)