function myFunction() {
    let ulToHide = document.getElementsByClassName('subMenu');
    for(let ul of ulToHide){
        ul.classList.toggle('show');
    }
}