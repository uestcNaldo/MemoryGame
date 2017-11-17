/*游戏的处理逻辑文件*/

/*卡片icon数组*/
var cardClassList = [
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
var selectedCardList = [];
var displayCardList = [];

/*游戏步数*/
var moves = 0;

/*星星数*/
var stars = 3;

/*定时器的全局对象*/
var time = 0, timer = null, timeObject = {h: 0, m: 0, s: 0},
    timeDisplay = {h: '00', m: '00', s: '00'};

/*点击卡片的缓存数组*/
var clickedCardList = [];
var isMatch = false;
var isMatched = new Array(16);

/*从16个元素的候选卡片类数组中选出8个*/
function initCardClassList(list, maxLength) {
    var resultList = [];
    while (resultList.length <= maxLength - 1) {
        var item = list[getRandomInt(0, list.length - 1)];
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
    var resultList = [];
    list.forEach(function (t) {
        resultList.push(t);
        //浅拷贝
        var obj = Object.assign({}, t);
        resultList.push(obj);
    });
    resultList = shuffle(resultList);
    return resultList;
}

/*随机交换位置*/
function shuffle(list) {
    var cardTemp = {};
    for (var i = 0; i < list.length; i++) {
        var j;
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
    var cardTemplate = "<div class=\"card\"><div class=\"front-side\"><i class=\"fa fa-question fa-2x\" aria-hidden=\"true\"></i></div><div class=\"back-side\"><i class=\"fa fa-3x\" aria-hidden=\"true\"></i></div></div>";
    var game = $("#game");
    var itemCard, backSide, backIcon;
    list.forEach(function (t) {
        game.append(cardTemplate);
        itemCard = $("#game").find(">.card:last-child");
        backSide = itemCard.find(".back-side");
        backIcon = backSide.find("i");
        backIcon.addClass(t.icon);
    });
    return list;
}

/*匹配成功操作*/
function setCardsSuccess(list) {
    list.forEach(function (t) {
        var itemCard, backSide, frontSide;
        itemCard = $("#game").find(">.card").eq(t.index);
        frontSide = itemCard.find(".front-side");
        backSide = itemCard.find(".back-side");
        backSide.addClass("successful");
        frontSide.remove();
        isMatched[t.index] = 1;
    });
    if (isFinish(isMatched)) {

    }
}

/*匹配失败操作*/
function setCardsFail(list) {
    var timeID;
    list.forEach(function (t, index) {
        var itemCard, backSide, frontSide;
        itemCard = $("#game").find(">.card").eq(t.index);
        frontSide = itemCard.find(".front-side");
        backSide = itemCard.find(".back-side");
        backSide.toggleClass("failed");
        timeID = window.setTimeout(delay, 650, itemCard, frontSide, backSide);
    });
}

function delay(card, front, back) {
    card.toggleClass("rotateY");
    front.toggle(250);
    back.toggleClass("failed");
}

/*卡片正面点击事件*/
function clickFrontSide() {
    if (clickedCardList.length >= 0 && clickedCardList.length < 2) {
        var clickedCard = $(this).parent();
        var frontSide = $(this);
        var index = clickedCard.index();
        clickedCard.toggleClass("rotateY");
        frontSide.toggle(100);
        moves++;
        displayMoves();
        displayCardList[index].index = index;
        clickedCardList.push(displayCardList[index]);
    }
    if (clickedCardList.length === 2) {
        isMatch = matchCards(clickedCardList);
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
    var clickedCard = $(this).parent();
    var frontSide = $(this).prev();
    if (isMatched[clickedCard.index()] === 0) {
        clickedCard.toggleClass("rotateY");
        frontSide.toggle(300);
        clickedCardList.pop();
    }
}

function isFinish(list) {
    return list.every(function (t) {
        return t === 1;
    });
}

function decreaseStars() {
    if (stars > 0 && stars <= 3){
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
    if (time > 30 && time <= 50) {

    }
    convertToTime(time);
    timeDisplay.h = convertToDoubleDigit(timeObject.h);
    timeDisplay.m = convertToDoubleDigit(timeObject.m);
    timeDisplay.s = convertToDoubleDigit(timeObject.s);
    displayTimer();
}

/*秒数转换为时间函数*/
function convertToTime(num) {
    var deltaDateObject = new Date(num*1000);
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

function resetGame() {
    time = 0;
    timeDisplay = {h: '00', m: '00', s: '00'};
    displayTimer();
    clearInterval(timer);
    timer = setInterval(startTimer, 1000);
    moves = 0;
    displayMoves();

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
    $(".front-side").click(clickFrontSide);
    $(".back-side").click(clickBackSide);
    $("#reset").click(resetGame);
});
