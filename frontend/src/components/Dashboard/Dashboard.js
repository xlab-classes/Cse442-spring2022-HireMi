import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Dashboard.module.scss';

const sampleData = [
    {title: 'sample0', thumbnail: 'none'},
    {title: 'sample1', thumbnail: 'none'},
    {title: 'sample2', thumbnail: 'none'},

]

const sampleTemplates = [
    {title: 'template1', thumbnail: 'none'},
    {title: 'template2', thumbnail: 'none'},
    {title: 'template3', thumbnail: 'none'},
    {title: 'template4', thumbnail: 'none'},
    {title: 'template5', thumbnail: 'none'},
    {title: 'template6', thumbnail: 'none'},
    {title: 'template7', thumbnail: 'none'},
    {title: 'template8', thumbnail: 'none'},
    {title: 'template9', thumbnail: 'none'},
    {title: 'template10', thumbnail: 'none'},
    {title: 'template11', thumbnail: 'none'},
    {title: 'template12', thumbnail: 'none'},
    {title: 'template13', thumbnail: 'none'},
    {title: 'template14', thumbnail: 'none'},
    {title: 'template15', thumbnail: 'none'},
    {title: 'template16', thumbnail: 'none'},
    {title: 'template17', thumbnail: 'none'},
    {title: 'template18', thumbnail: 'none'},
    {title: 'template19', thumbnail: 'none'},
    {title: 'template20', thumbnail: 'none'},
    {title: 'template21', thumbnail: 'none'},
    {title: 'template22', thumbnail: 'none'},
    {title: 'template23', thumbnail: 'none'},
    {title: 'template24', thumbnail: 'none'},
    {title: 'template25', thumbnail: 'none'},
    {title: 'template26', thumbnail: 'none'},
    {title: 'template27', thumbnail: 'none'},
]

const Dashboard = (props) => {

    const [isDrawer, setDrawer] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    // this may mount the builder component

    useEffect(()=>{
        setLoaded(true);
    }, []);

    return (
        <div className={styles['page-root']}>
            <section className={styles['workspace']}>
                <div className={styles['documents-space']}>
                    <NewDocument/>
                    {sampleData.map((el)=> <Document key={el.title} title={el.title}/>)}
                </div>
            </section>
            <section className={isDrawer ? `${styles.templates} ${styles.active}` : styles['templates']}>
                <div className={`${styles['templates-options']}`}>
                    {sampleTemplates.map(el => <Template key={el.title} title={el.title} isDrawer={isDrawer} />)}
                </div>
                <span className={`${styles['templates-fade']}`}/>
                <div className={`${styles['templates-btn-div']}`}>
                    <div className={`${styles['templates-btn-wrap']}`}>
                        {isDrawer ? <FontAwesomeIcon icon="fa-solid fa-angle-left" /> : null}
                        <button className={`${styles['templates-btn']}`} onClick={()=> {setDrawer(!isDrawer)}}>
                            {isDrawer ? ('Collapse the templates view') : 'Look around more templates'}
                        </button>
                        {isDrawer ? null : <FontAwesomeIcon icon="fa-solid fa-angle-right" />}
                    </div>
                </div>
            </section>
        </div>
    )
}

const NewDocument = () => {
    return (
        <div className={`${styles['new-doc']}`}>
            <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
    )
}

const Document = props => {


    return (
        <div className={`${styles['single-doc']}`}>

        </div>
    )
}

const Template = ({isDrawer}) => {

    return (
        <div className={isDrawer ? `${styles['single-template']} ${styles.active}` : `${styles['single-template']}`}>

        </div>
    )
}

export default Dashboard;
