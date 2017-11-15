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

/*游戏步数*/
var moves = 0;

/*定时器的全局对象*/
var time = 0, timer = null, timeObject = {h: 0, m: 0, s: 0},
    timeDisplay = {h: '00', m: '00', s: '00'};

function initCardClassList() {

}

/*注册卡片点击事件*
*卡片正面点击事件*/

function displayMoves() {
    $("#moves").text(moves);
}

$(".front-side").click(function () {
    var clickedCard = $(this).parent();
    var frontSide = $(this);
    clickedCard.toggleClass("rotateY");
    frontSide.fadeToggle(300);
    moves++;
    displayMoves();
});

/*卡片背面点击事件*/
$(".back-side").click(function () {
    var clickedCard = $(this).parent();
    var frontSide = $(this).prev();
    clickedCard.toggleClass("rotateY");
    frontSide.fadeToggle(300);
});

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



/*document加载完成回调函数*/
$(document).ready(function () {
    //定时器开始计时
    displayTimer();
    timer = setInterval(startTimer, 1000);
});
