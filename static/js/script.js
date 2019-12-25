function create_list(){
    const nums = [1,7,16,9,5,7,3,33,67,9,2,8,67];
    const list_ul = document.createElement('ul')

    for(let num of nums){
        const list_li = document.createElement('li');
        list_li.addEventListener('click', function() {
            this.classList.toggle('selected');
         });
        li_text = document.createTextNode(num.toString());
        list_li.appendChild(li_text);
        list_ul.appendChild(list_li);
    }
    return list_ul;
}

aimP = document.getElementsByTagName('p')[1];
aimP.appendChild(create_list());