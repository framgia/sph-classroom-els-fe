import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner'
import style from "./index.module.css"

import CategoryApi from '../../../../api/Category';
import Listdescript from './components';

function Subcategories() {
    const [categories, setCategories] = useState(null)

    
    const Subcategories = [
        
        {
            
            id: 1,
            title: 'Basic',
            firstRow: 'Beginner',
            secRow: '10 Quizzes',
            thirRow: '6 Quizzes',
        },
        {
            id: 2,
            title: 'Arrays',
            firstRow: 'Intermediate',
            secRow: '10 Quizzes',
            thirRow: '1 Quizzes',
        },
        {
            id: 3,
            title: 'DOM',
            firstRow: 'Hard',
            secRow: '10 Quizzes',
            thirRow: '8 Quizzes',
        },
        {
            id: 4,
            title: 'Object-Oriented Programming',
            firstRow: 'Intermediate',
            secRow: '10 Quizzes',
            thirRow: '5 Quizzes',
        },
        {
            id: 5,
            title: 'ECMAScript – ES6',
            firstRow: 'Hard',
            secRow: '10 Quizzes',
            thirRow: '3 Quizzes',
        },
        {
            id: 6,
            title: 'Classes and Objects',
            firstRow: 'Beginner',
            secRow: '10 Quizzes',
            thirRow: '5 Quizzes',
        },
        {
            id: 7,
            title: 'HTML',
            firstRow: 'Intermediate',
            secRow: '10 Quizzes',
            thirRow: '3 Quizzes',
        },
        {
            id: 8,
            title: 'DOM',
            firstRow: 'Beginner',
            secRow: '10 Quizzes',
            thirRow: '1 Quizzes',
        },
       
    ]

    useEffect(() => {
        CategoryApi.getAll()
        .then(({ data }) => {
            setCategories(data.data)
        })
    }, [])

    const renderCatList = () => {
        return Subcategories.map((subcategory) => {
            return (
                <Card className={style.card}>
                <Card.Header id={style.cardHeader}>{subcategory.title}</Card.Header >
                <Card.Body >
                <Link >
                    <div className={style.cardContent}>
                        <Listdescript firstRow={subcategory.firstRow} secRow={subcategory.secRow} thirRow={subcategory.thirRow}/>
                    </div>
                </Link>   
                </Card.Body>
                </Card>
            )
        })     
        
    }

    return (
        <div>
            <div className={style.subTile}>
                <div>
                <p className={style.title}>Web Development</p>
                </div>
                <div id={style.quizlink}>
                    <a style={{color:'black', fontSize:'20px'}} href='categories/:id/quizzes' >Check Available Quizzes >></a>
                </div>
            </div>
            
            {categories === null ? 
                <div className={style.loading}>
                    <Spinner animation="border" role="status"></Spinner>
                    <span className={style.loadingWord}>Loading</span>
                </div>
                :
                <div className={style.cardList}>
                  {renderCatList()}  
                </div>
            }
        </div>
    );
}

export default Subcategories;

