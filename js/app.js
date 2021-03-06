/*游戏的处理逻辑文件*/

/*卡片icon数组*/
const cardClassList = [
    {name: "camera", icon: "fa-camera-retro"},
    {name: "telegram", icon: "fa-telegram"},
    {name: "car", icon: "fa-car"},
    {name: "bicycle", icon: "fa-bicycle"},
    {name: "bolt", icon: "fa-bolt"},
    {name: "birthday-cake", icon: "fa-birthday-cake"},
    {name: "heart", icon: "fa-heart"},
    {name: "snowflake-o", icon: "fa-snowflake-o"},
    {name: "chrome", icon: "fa-chrome"},
    {name: "github", icon: "fa-github"},
    {name: "qq", icon: "fa-qq"},
    {name: "pagelines", icon: "fa-pagelines"},
    {name: "tree", icon: "fa-tree"},
    {name: "apple", icon: "fa-apple"},
    {name: "file", icon: "fa-file"},
    {name: "television", icon: "fa-television"}
];

/*被选择的卡片数组（个数=8）*/
let selectedCardList = [];
let displayCardList = [];

/*游戏步数*/
let moves = 0;

/*星星数*/
let stars = 3;

/*定时器的全局对象*/
let time = 0, timer = null, timeObject = {h: 0, m: 0, s: 0},
    timeDisplay = {h: '00', m: '00', s: '00'};

/*点击卡片的缓存数组*/
let clickedCardList = [];
let isMatch = false;
let isMatched = new Array(16);

/*从16个元素的候选卡片类数组中选出8个*/
function initCardClassList(list, maxLength) {
    let resultList = [];
    while (resultList.length <= maxLength - 1) {
        let item = list[getRandomInt(0, list.length - 1)];
        if (resultList.indexOf(item) === -1) {
            resultList.push(item);
        }
    }
    return resultList;
}

/*获取在min和max之间的整数*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max - min) + min);
}

/*初始化显示卡片的数组displayCardList*/
function initDisplayCardList(list) {
    let resultList = [];
    list.forEach(function (t) {
        resultList.push(t);
        //浅拷贝
        let obj = Object.assign({}, t);
        resultList.push(obj);
    });
    resultList = shuffle(resultList);
    return resultList;
}

/*随机交换位置*/
function shuffle(list) {
    let cardTemp = {};
    for (let i = 0; i < list.length; i++) {
        let j;
        j = getRandomInt(0, list.length - 1);
        if (i === j || list[i] === list[j]) {
            i--;
            continue;
        }
        cardTemp = list[i];
        list[i] = list[j];
        list[j] = cardTemp;
    }
    return list;
}

/*动态加载卡片*/
function loadCardList(list) {
    let cardTemplate = '<div class="card"><div class="front-side"><i class="fa fa-question fa-2x" aria-hidden="true"></i></div><div class="back-side"><i class="fa fa-3x" aria-hidden="true"></i></div></div>';
    let $game = $("#game");
    let itemCard, backSide, backIcon;
    list.forEach(function (t) {
        $game.append(cardTemplate);
        itemCard = $game.find(">.card:last-child");
        backSide = itemCard.find(".back-side");
        backIcon = backSide.find("i");
        backIcon.addClass(t.icon);
    });
    return list;
}

/*匹配成功操作*/
function setCardsSuccess(list) {
    let $game = $("#game");
    list.forEach(function (t) {
        let itemCard, backSide, frontSide;
        itemCard = $game.find(">.card").eq(t.index);
        frontSide = itemCard.find(".front-side");
        backSide = itemCard.find(".back-side");
        backSide.addClass("successful");
        isMatched[t.index] = 1;
        backSide.off("click.backSide");
    });
    if (isFinish(isMatched)) {
        window.setTimeout(displaySuccess, 1000);
    }
}

function displaySuccess() {
    let modalWrapper = $(".modal-wrapper");
    let getStars = modalWrapper.find(".get-stars");
    let getTime = modalWrapper.find(".get-time");
    getStars.text(getStars.text() + stars + " Stars");
    getTime.text(getTime.text() + $(".timer").text());
    $(".modal").css("z-index", "11");
}

/*匹配失败操作*/
function setCardsFail(list) {
    let timeID;
    let $game = $("#game");
    list.forEach(function (t) {
        let itemCard, backSide, frontSide;
        itemCard = $game.find(">.card").eq(t.index);
        frontSide = itemCard.find(".front-side");
        backSide = itemCard.find(".back-side");
        backSide.toggleClass("failed");
        timeID = window.setTimeout(delayFailed, 500, itemCard, frontSide, backSide);
    });
}

/*延迟函数*/
function delayFailed(card, front, back) {
    card.toggleClass("rotateY");
    front.toggle(200);
    back.toggleClass("failed");
}

/*卡片正面点击事件*/
function clickFrontSide() {
    if (clickedCardList.length >= 0 && clickedCardList.length < 2) {
        let clickedCard = $(this).parent();
        let frontSide = $(this);
        let index = clickedCard.index();
        clickedCard.toggleClass("rotateY");
        frontSide.toggle(100);
        displayCardList[index].index = index;
        clickedCardList.push(displayCardList[index]);
        if (stars === 3 && moves >= 16 && moves < 24){
            decreaseStars(3);
        }else if (stars === 2 && moves >= 24 && moves < 32){
            decreaseStars(2);
        }
    }
    if (clickedCardList.length === 2) {
        isMatch = matchCards(clickedCardList);
        moves++;
        displayMoves();
        if (isMatch){
            setCardsSuccess(clickedCardList);
        } else {
            setCardsFail(clickedCardList);
        }
        clickedCardList = [];
    }
}

/*匹配卡片*/
function matchCards(list) {
    return list[0].name === list[1].name && list[0].icon === list[1].icon;
}

/*卡片背面点击事件*/
function clickBackSide() {
    let clickedCard = $(this).parent();
    let frontSide = $(this).siblings(".front-side");
    clickedCard.toggleClass("rotateY");
    frontSide.toggle(200);
    clickedCardList.pop();
}

/*游戏是否成功*/
function isFinish(list) {
    return list.every(function (t) {
        return t === 1;
    });
}

/*星星减少函数*/
function decreaseStars(index) {
    if (stars > 0 && stars <= 3){
        let lastStar = $(".stars").find("i").eq(index-1);
        lastStar.removeClass("fa-star");
        lastStar.addClass("fa-star-o");
        stars--;
    }
}

/*显示步数*/
function displayMoves() {
    $("#moves").text(moves);
}

/*启动定时器函数*/
function startTimer() {
    time++;
    convertToTime(time);
    timeDisplay.h = convertToDoubleDigit(timeObject.h);
    timeDisplay.m = convertToDoubleDigit(timeObject.m);
    timeDisplay.s = convertToDoubleDigit(timeObject.s);
    displayTimer();
}

/*秒数转换为时间函数*/
function convertToTime(num) {
    let deltaDateObject = new Date(num*1000);
    timeObject.h = deltaDateObject.getHours() - 8;
    timeObject.m = deltaDateObject.getMinutes();
    timeObject.s = deltaDateObject.getSeconds();
}

/*转换单个数字为两位数*/
function convertToDoubleDigit(num) {
    if (num < 10){
        return "0"+num;
    }else {
        return num;
    }
}

/*显示定时器函数*/
function displayTimer() {
    $(".timer").text(timeDisplay.h + ":" + timeDisplay.m + ":" + timeDisplay.s);
}

/*重置游戏函数*/
function resetGame() {
    time = 0;
    timeDisplay = {h: '00', m: '00', s: '00'};
    displayTimer();
    clearInterval(timer);
    timer = setInterval(startTimer, 1000);
    moves = 0;
    displayMoves();
    if (clickedCardList.length === 1){
        let index = clickedCardList[0].index;
        let itemCard = $("#game").find(".card").eq(index);
        let frontSide = itemCard.find(".front-side");
        itemCard.toggleClass("rotateY");
        frontSide.toggle(200);
        clickedCardList.pop();
    }
    isMatched.forEach(function (t, number) {
        if (t === 1){
            let itemCard = $("#game").find(".card").eq(number);
            let frontSide = itemCard.find(".front-side");
            let backSide = itemCard.find(".back-side");
            itemCard.toggleClass("rotateY");
            frontSide.toggle(200);
            backSide.removeClass("successful");
        }
    });
    isMatched.fill(0);
    stars = 3;
    $(".stars").find(".fa-star-o").removeClass("fa-star-o").addClass("fa-star");
}

/*重新开始函数*/
function tryAgain() {
    window.location.reload();
}

/*document加载完成回调函数*/
$(document).ready(function () {
    //定时器开始计时
    displayTimer();
    timer = setInterval(startTimer, 1000);
    //初始化卡片数组
    selectedCardList = initCardClassList(cardClassList, 8);
    displayCardList = initDisplayCardList(selectedCardList);
    isMatched.fill(0);
    //动态加载卡片类
    displayCardList = loadCardList(displayCardList);
    //注册卡片点击事件
    $(".front-side").on("click.frontSide", clickFrontSide);
    $(".back-side").on("click.backSide", clickBackSide);
    $("#reset").on("click.reset", resetGame);
    $("#try").on("click.try", tryAgain);
});
