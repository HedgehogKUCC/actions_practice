// 參考來源
// https://shhhhh-ycy.medium.com/pagination-%E5%88%86%E9%A0%81%E5%B7%A5%E5%85%B7-d04e3f0c23b0
// https://codepen.io/chingyuan/pen/OJVyQRQ?editors=0010

const INPUT = document.querySelector('#input_pageTotal input');
const BITTON = document.querySelector('#input_pageTotal button');
const paginationGroup = document.getElementById('pagination__group');

const PAGINATION = {
    nowPage: 1,
    totalPage: 0,
};

INPUT.addEventListener('input', function (e) {
    checkInputField(e.target);
});

INPUT.addEventListener('keypress', function (e) {
    if (!(e.keyCode === 13)) { return; }
    if (checkInputField(e.target)) { init(); }
});

BITTON.addEventListener('click', () => {
    init();
});

function checkInputField(element) {
    const IN_NUM = +element.value.trim();
    if (!(IN_NUM >= 1 && IN_NUM <= 100)) {
        element.value = '';
        paginationGroup.innerHTML = '';
        return false;
    }
    PAGINATION.totalPage = IN_NUM;
    return true;
}

function init() {
    PAGINATION.nowPage = 1;
    if (PAGINATION.totalPage > 5) {
        overFivePageRender();
        overFivePageListener();
    } else {
        pageRender();
        pageListener();
    }
}

function pageRender() {
    const { totalPage, nowPage } = PAGINATION;
    const ary = [];
    let num = 1;

    while (num <= totalPage) {
        const classList = num === nowPage ? 'active' : '';
        ary.push({ val: num, class: classList });
        num += 1;
    }

    listRender(ary);
}

function pageListener() {
    document.querySelectorAll('.pagination__item').forEach((el) => {
        el.addEventListener('click', () => {
            if (el.dataset.val > 0) {
                PAGINATION.nowPage = +el.dataset.val;
                pageRender();
                pageListener();
            }
        });
    });
}

function overFivePageRender() {
    const { totalPage, nowPage } = PAGINATION;
    const pageStatus = overFivePageJudgePageStatus(nowPage, totalPage);
    const ary = overFivePageGenerateData(pageStatus, nowPage, totalPage);
    listRender(ary);
}

function overFivePageJudgePageStatus(nowPage, totalPage) {
    return nowPage === 1 ? 'first' : nowPage <= totalPage / 2 ? 'front' : nowPage !== totalPage ? 'back' : 'last';
}

function overFivePageGenerateData(pageStatus, nowPage, totalPage) {
    const MAP = {
        first: [
            { val: -2, class: 'pre unclick' },
            { val: nowPage, class: 'active' },
            { val: nowPage + 1, class: '' },
            { val: nowPage + 2, class: '' },
            { val: -1, class: 'unclick' },
            { val: totalPage, class: '' },
            { val: -3, class: 'next' },
        ],
        front: [
            { val: -2, class: 'pre' },
            { val: nowPage - 1, class: '' },
            { val: nowPage, class: 'active' },
            { val: nowPage + 1, class: '' },
            { val: -1, class: 'unclick' },
            { val: totalPage, class: '' },
            { val: -3, class: 'next' },
        ],
        back: [
            { val: -2, class: 'pre' },
            { val: 1, class: '' },
            { val: -1, class: 'unclick' },
            { val: nowPage - 1, class: '' },
            { val: nowPage, class: 'active' },
            { val: nowPage + 1, class: '' },
            { val: -3, class: 'next' },
        ],
        last: [
            { val: -2, class: 'pre' },
            { val: 1, class: '' },
            { val: -1, class: 'unclick' },
            { val: nowPage - 2, class: '' },
            { val: nowPage - 1, class: '' },
            { val: nowPage, class: 'active' },
            { val: -3, class: 'next unclick' },
        ],
    };
    return MAP[pageStatus];
}

function listRender(ary) {
    paginationGroup.innerHTML = '';
    const FRAGMENT = document.createDocumentFragment();
    ary.forEach((el) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        li.setAttribute('data-val', el.val);
        li.setAttribute('class', `pagination__item ${el.class}`);
        a.setAttribute('href', 'javascript:;');
        // a.setAttribute('href', '/coupon.php?usablePage=' + el.val);
        a.innerText = el.val > 0 ? el.val : el.val === -1 ? '...' : el.val === -2 ? '<<' : el.val === -3 ? '>>' : '';
        li.appendChild(a);
        FRAGMENT.appendChild(li);
    });
    paginationGroup.appendChild(FRAGMENT);
}

function overFivePageListener() {
    preBtnSet();
    nextBtnSet();
    document.querySelectorAll('.pagination__item').forEach((el) => {
        if (el.dataset.val > 0) {
            el.addEventListener('click', () => {
                overFivePageChange(el.dataset.val);
            });
        }
    });
}

function preBtnSet() {
    document.querySelector('#pagination__group .pre').addEventListener('click', function () {
        if (this.classList.value.indexOf('unclick') === -1) {
            overFivePageChange(PAGINATION.nowPage - 1);
        }
    });
}

function nextBtnSet() {
    document.querySelector('#pagination__group .next').addEventListener('click', function () {
        if (this.classList.value.indexOf('unclick') === -1) {
            overFivePageChange(PAGINATION.nowPage + 1);
        }
    });
}

function overFivePageChange(num) {
    PAGINATION.nowPage = +num;
    overFivePageRender();
    overFivePageListener();
}
