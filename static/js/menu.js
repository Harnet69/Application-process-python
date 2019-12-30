function hideShowSub() {
    let ulToHide = document.getElementsByClassName('subMenu');
    for(let ul of ulToHide){
        this.classList.toggle('show');
    }
}

function openCloseCat() {
    let categories = document.getElementsByClassName('subMenuCat');
    for(let cat of categories){
        cat.addEventListener('click', function () {
            hideShowSub();
        })
    }
}

openCloseCat();