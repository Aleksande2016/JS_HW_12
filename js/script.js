class User{
    constructor({ id, name, email, address, phone }) {    
         this.date = { id, name, email, address, phone }
         this.editMode = false
    }

    edit(newCtact){
        this.date = { ...this.date, ...newCtact }
    }

    get() {
        return this.date
    }
}

class Contacts{
    constructor() {
        this.contactsData = this.getcontactsData();        ;
    }

    getcontactsData() {
        let data = localStorage.getItem('contcatsData') ? JSON.parse(localStorage.getItem('contcatsData')) : [];
        if(data.length > 0){
            data = data.map(({date}) => new User(date))
            return data
        }
        return data
    }

    add({name, email, address, phone}){
        const user = new User({
            id: Date.now(),
            name,
            email,
            address,
            phone,
        })

        this.contactsData.push(user);
    }

    remove(idContact) {
        // this.contactsData.find(({id}) => id !== idContact)        
        // this.contactsData = this.contactsData.filter((contact) => contact.date.id != idContact)
        this.contactsData = this.contactsData.filter(({date:{id}}) => id != idContact)
    }


    edit(userEdit, newContactData){
        console.log(userEdit)        
        userEdit.edit(newContactData)
    }

    get(){
        return this.contactsData
    }
}

class ContactsApp extends Contacts {
    constructor(){
        super();
        this.inputName;
        this.inputPhone;
        this.inputEmail;
        this.inputAddress;
        this.addButton;
        this.app;
        this.createHTML();
        this.addEvent();
    }

    createHTML() {

        const contcatOption  = document.createElement('div');
        contcatOption.classList.add('contacts__options');

        this.app = document.createElement('div');
        this.inputName = document.createElement('input');
        this.inputPhone = document.createElement('input');
        this.inputEmail = document.createElement('input');
        this.inputAddress = document.createElement('input'); 
        this.addButton = document.createElement('button');
        this.editButton = document.createElement('button');

        this.inputName.classList.add('contact__name');
        this.inputPhone.classList.add('contact__phone');
        this.inputEmail.classList.add('contact__email');
        this.inputAddress.classList.add('contact__address');
        this.addButton.classList.add('contact__button__add');

        this.addButton.innerHTML="Добавить контакт"

        contcatOption.appendChild(this.inputName);
        this.inputName.setAttribute('placeholder', 'Введите имя')
        contcatOption.appendChild(this.inputPhone);
        this.inputPhone.setAttribute('placeholder', 'Введите телефон')
        contcatOption.appendChild(this.inputEmail);
        this.inputEmail.setAttribute('placeholder', 'Введите E-mail')
        contcatOption.appendChild(this.inputAddress);
        this.inputAddress.setAttribute('placeholder', 'Введите адрес')
        contcatOption.appendChild(this.addButton);

        this.app.appendChild(contcatOption);

        this.app.classList.add('contacts')
        document.body.appendChild(this.app) 
        this.onShow()       
        
    }

    addEvent(){      
        this.addButton.addEventListener('click', ()=>{
            this.onAdd(this.createInputObject())
            this.clearInput();
        })
    }

    onAdd(addObj) {
        this.add(addObj);
        this.onShow();
    }

    onShow() {
        const data = this.get();
        localStorage.setItem('contcatsData', JSON.stringify(data))
        let ul = document.querySelector('.contacts__items')
        console.log(data);
        if(!ul){
            ul = document.createElement('ul');
            ul.classList.add('contacts__items')
        }

        let list = '';
        

        if (!data) return
        data.forEach(({date:{name, address, id, email, phone}, editMode}) => {
            list += `<li class="contact__item">
            <p><span class="color">Имя: </span>${name}</p>  
            <p><span class="color">Телефон: </span>${phone}</p>
            <p><span class="color">E-mail: </span>${address}</p>    
            <p><span class="color">Адрес: </span>${email}</p>
            <div><button class="contact__item__delete" id="${id}">Удалить</button>
                            ${editMode ? "<button class='contact__item__save' data-save="+id+">Save</button>" : '<button class="contact__item__edit" data-edit='+id+'>Редактировать</button></div>'}       
                    </li>`
        })

        ul.innerHTML = list;
        this.app.appendChild(ul);
        this.onAddEventRemoveEdit();

    }

    onAddEventRemoveEdit() {
        const deleteBtn = document.querySelectorAll('.contact__item__delete')
        const editBtns = document.querySelectorAll('.contact__item__edit')

        deleteBtn.forEach((delBtn) => {
            delBtn.addEventListener('click', (event) => {
                this.onDelete(event.target.id)
            })
        })

        editBtns.forEach((editBtn)=>{
            editBtn.addEventListener('click', (event) => {
                this.onEdit(event.target.dataset.edit)
            })
        })


    }

    onDelete(id) {
        this.remove(id);
        this.onShow();
    }

    onEdit(idEdit){
        const data = this.get();
        const editusers = data.map((item) => {
            if(item.date.id == idEdit) {
                item.editMode = true
            }else {
                item.editMode = false
            }
            return item
        })


        this.addButton.setAttribute('disabled','true')
        this.onShow();

        const userEdit = data.find(({date:{id}}) => id == idEdit)
        console.log(userEdit)

        const { name, phone, email, address } = userEdit.date;

        this.inputName.value = name;
        this.inputPhone.value = phone;
        this.inputEmail.value = email;
        this.inputAddress.value = address;

        const saveBtn = document.querySelector('.contact__item__save')

        if(!saveBtn) return;

        saveBtn.addEventListener('click',() => {
            //userEdit.editMode = false;
            this.addButton.removeAttribute('disabled')
            const newContactData = this.createInputObject();
            userEdit.editMode = false
            
            this.edit(userEdit, newContactData)
            this.clearInput()
            this.onShow();
        } )

    }

    get() {
        return super.get() 
    }

    clearInput() {
        this.inputName.value = '';
        this.inputEmail.value = '';
        this.inputPhone.value = '';
        this.inputAddress.value = ''
    }

    createInputObject() {
        return {
            name: this.inputName.value,
            phone: this.inputPhone.value,
            email: this.inputEmail.value,
            address: this.inputAddress.value,
        }
    }
}

window.addEventListener('load', () => {
   const contacts = new ContactsApp();
   console.log(contacts);   
})