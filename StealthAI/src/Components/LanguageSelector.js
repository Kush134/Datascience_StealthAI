import React from "react";

const LanguageSelector = (props) => {
    const {langValue, setLangValue} = props;
    return (
        <>
            <label htmlFor="Select Language" className='label'>Language *</label>
            <select className="form-select input" aria-label="Default select example" name="Select Language"
                    value={langValue}
                    onChange={e => setLangValue(e.target.value)}>
                <option value={-1}>English</option>
                <option value={0}>Aragonese</option>
                <option value={1}>Catalan</option>
                <option value={2}>Corsican</option>
                <option value={4}>French</option>
                <option value={5}>Galician</option>
                <option value={6}>Italian</option>
                <option value={7}> Latin</option>
                <option value={8}>Occitan</option>
                <option value={9}>Portuguese</option>
                <option value={10}>Romansh</option>
                <option value={11}>Romanian</option>
                <option value={12}> Spanish</option>
                <option value={13}>Wallon</option>
            </select>
        </>
    )
}

export default LanguageSelector;
