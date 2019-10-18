let menu_div = document.getElementById("main-menu");
let game_div = document.getElementById("game-menu");

function initGame() 
{
    toggleMenu(menu_div, false);
    toggleMenu(game_div, true);
}


function toggleMenu(ele, bool)
{
    if(bool != undefined)
    {
        ele.classList.toggle("hidden", !bool);
    }
    else
    {
        ele.classList.toggle("hidden");
    }
}