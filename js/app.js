/*游戏的处理逻辑文件*/

/*注册卡片点击事件*/
$(".front-side").click(function () {
    var clickedCard = $(this).parent();
    var frontSide = $(this);
    clickedCard.toggleClass("rotateY");
    frontSide.fadeToggle(300);
});

$(".back-side").click(function () {
    var clickedCard = $(this).parent();
    var frontSide = $(this).prev();
    clickedCard.toggleClass("rotateY");
    frontSide.fadeToggle(300);
});