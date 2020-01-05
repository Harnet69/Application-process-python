// function create_list(){
//     const nums = [1,7,16,9,5,7,3,33,67,9,2,8,67];
//     const list_ul = document.createElement('ul')
//
//     for(let num of nums){
//         const list_li = document.createElement('li');
//         list_li.addEventListener('click', function() {
//             this.classList.toggle('selected');
//          });
//         li_text = document.createTextNode(num.toString());
//         list_li.appendChild(li_text);
//         list_ul.appendChild(list_li);
//     }
//     return list_ul;
// }
//
// function create_button() {
//     const my_btn = document.createElement('button');
//     my_btn.addEventListener('click', show_hide);
//     button_text = document.createTextNode('Hide/Show');
//     my_btn.appendChild(button_text);
//     return my_btn;
// }
//
// function show_hide(){
//     first_p = document.getElementById('my')
//     first_p.classList.toggle('hide');
//     // this.classList.toggle('hide');
// }
//
// function inputKeyUp(e) {
//     if (e.key === 'Enter') {
//         console.log('Enter has been pressed')
//     }
// }
//
// aimP = document.getElementsByTagName('p')[0];
// aimP.appendChild(create_list());
//
// last_p = document.getElementsByTagName('p')[1];
// last_p.appendChild(create_button());

var li_tag = document.getElementById('my');
var isYellow = true;

li_tag.addEventListener('click', function () {
    if (isYellow) {
        li_tag.style.background = 'yellow';
        isYellow = false;
        li_tag.textContent = 'Hello, master';
    } else {
        li_tag.style.background = 'green';
        isYellow = true;
        li_tag.textContent = 'Good bye  , master';
    }

});

li_tag.addEventListener('mouseover',function () {
    li_tag.classList.toggle('big');
})
