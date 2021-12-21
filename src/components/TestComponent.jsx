import { React, useState} from 'react'

function TestComponent () {

    const languages = [
        {
            id: 1,
            title: "JavaScript"
        }, 
        {
            id: 2,
            title: "php"
        }, 
        {
            id: 3,
            title: 'Python'
        }
    ];

    const [langs, setLangauge] = useState(languages);
    const [selectedLanguage, setSeletedLanguage] = useState(languages[0])

    return (
        <div>
            <h1>Hello World</h1>
            {langs.map((lang, index) => (
                <div>
                    <span>({index + 1}) {lang.title} &nbsp; &nbsp;</span>
                    <button onClick={ () => {setSeletedLanguage(lang)} }>Set {lang.title}</button>
                </div>
            ))}

            <p style={{border: '1px solid grey'}}>{selectedLanguage.title}</p>

        </div>
    )
}

export default TestComponent;