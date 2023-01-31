import { useState, useRef, MutableRefObject } from 'react';
import SearchBarIsland from './SearchBar';
import { Redirect } from 'react-router';
import '../styles/global.css';

const DashboardIsland = () => {


    const existingId = localStorage.getItem('o-id');
    const logoutBtn: MutableRefObject<HTMLButtonElement> = useRef(null);
    if(!existingId){
        window.location.href = "/";
        // return (<Redirect exact from="/dashbaord" to="/"/>)
    }

    function handleLogout() {
        localStorage.removeItem('o-id');
        window.location.href = '/'
        // return (<Redirect exact from="/dashbaord" to="/"/>)
    }

    return (
        <>
            <div>
                <div className="flex bg-gray-600 text-white h-12">
                    <div className="font-bold flex-auto w-1/2 text-start p-3">
                    URLs
                    </div>
                    <div className="flex-auto w-1/2 text-end px-3 py-2" >
                        <button ref={logoutBtn} onClick={() => {
                            handleLogout();
                        }} className="bg-rose-600 py-1 px-3 rounded drop-shadow" id="logout-btn">Logout</button>
                    </div>
                </div>
            <SearchBarIsland />
            </div>
        </>
    )
}

export default DashboardIsland;