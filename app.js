const express = require ('express')
const res = require('express/lib/response')
const app = express()

const fs =require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('',(req, res) => {
    res.render('home')
})

app.get('/create', (req,res) => {
    res.render('create')
})

app.post('/create',(req,res)=> {
     const title = req.body.title
     const description = req.body.description
   // validation for empty input values
    if(title.trim()== '' && description.trim()== '') {
        res.render('create', { error: true})
    } 
    else if
        (title.trim()== ''){
        res.render( 'create',{ error_title: true})
    }
    else if
        (description.trim()== ''){
        res.render( 'create',{ error_description: true})
        }
     else {
        fs.readFile('./data/all.json', (err, data) =>{
            if (err) throw err
            
            const students = JSON.parse(data)
          
            students.push({
                id: id (),
                title: title,
                description: description,
                archive_record: false,
            })
            fs.writeFile('./data/all.json', JSON.stringify(students), err => {
                if (err) throw err

                res.render('create', { success: true })
            })
        })
    }  
})

// deleting record
 
app.get('/all/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/all.json',(err, data)  => { 
        if (err) throw err
        
        const students = JSON.parse(data)

        const filteredStudents = students.filter(student => student.id != id)

        fs.writeFile('./data/all.json', JSON. stringify(filteredStudents),(err) => {
            if (err) throw err

            res.render('create', { students: filteredStudents, deleted: true })
        })
    })
})


// shows all records 
app.get('/all',(req,res)=> {
   
    fs.readFile('./data/all.json', (err, data )  => { 
        if (err) throw err

        const students = JSON.parse(data)
        const filteredStudents = students.filter(student => student.archive_record == false )
        res.render('all', { students: filteredStudents })
        
    })
})


// archives record

app.get('/archive', (req, res) => {
    fs.readFile('./data/all.json', (err, data) => {
        if (err) throw err
        const students = JSON.parse(data)
        const filteredStudents = students.filter(student => student.archive_record == true )
        res.render('archive', { students: filteredStudents })
    })
})



app.get('/all/:id/archive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/all.json', (error, data) => {
        if (error) throw error

        const students = JSON.parse(data)
        const student = students.find(student => student.id == id)

        let idx = students.indexOf(student)

        students[idx].archive_record = true

        fs.writeFile('./data/all.json', JSON.stringify(students), (error) => {
            if (error) throw error
            res.redirect('/all')
        })
    })
})


app.get('/all/:id/unarchive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/all.json', (error, data) => {
        if (error) throw error

        const students = JSON.parse(data)
        const student = students.find(student => student.id == id)

        let idx = students.indexOf(student)

        students[idx].archive_record = false

        fs.writeFile('./data/all.json', JSON.stringify(students), (error) => {
            if (error) throw error
            res.redirect('/archive')
        })
    })
})

// shows detailed information of each student
app.get('/all/:id', (req,res) => {
    const id = req.params.id

    fs.readFile('./data/all.json', (err, data) => { 
        if (err) throw err

        const students = JSON.parse(data)

        const student = students.find(student => student.id == id)

        res.render('detail', { student: student })  
    })

    
})


app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000....')
})


// creates random Id for each record
function id(){
    return '_' + Math.random().toString(36).substring(2, 9);
}