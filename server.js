const express = require('express');
const uuid = require('uuid');
const faker = require('faker');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express();


//  Middleware
server.use( cors() )
server.use( bodyParser.json() );

//  Data

let contacts = [];

for(let i=0; i < 8; i++) {
    contacts.push({
        id: uuid.v4(),
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber()
    })
}

server.get('/contacts', (req, res) => {

    res.send( {
        success: true,
        data: {
            contacts: contacts
        }
    })
})

server.get('/contacts/:id', (req, res) => {

    let index = contacts.findIndex( contact => contact.id === req.params.id );

    if(index === -1) {
        res.send(404)
    } else {
        res.send({
            success: true,
            data: {
                contact: contacts[index]
            }
        })
    }
})

//  Add Contact
server.post('/contacts', (req, res) => {

        if(req.body.contact === undefined) {
            res.send({
                success: false,
                err: 'Missing contact object'
            })

            return;
        }


        let newContact = {
            id: uuid.v4(),
            ...req.body.contact
        }

        contacts.push(newContact)

        res.send({
            success: true,
            data: {
                contact: newContact
            }
        })
})

//  Delete Contact by Id
server.delete('/contacts/:contactId', (req, res) => {

    let oldLength = contacts.length;

    let response = {
        success: true
    }

    contacts = contacts.filter( contact => contact.id != req.params.contactId )  

    if(oldLength == contacts.length) {
        response.success = false,
        response.err = 'Contact not found'
    }

    res.send( response )

})

server.listen(3000, () =>{
    console.log('Server staretd at http://localhost:3000');
})