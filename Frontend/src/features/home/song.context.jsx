import { useState } from "react";

import { createContext } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/uvay9sfgx/cohort-2/moodify/songs/Ye_Bikhra_Hai_Saaman__DOWNLOAD_MING__731TX7BQF.mp3",
        "posterUrl": "https://ik.imagekit.io/uvay9sfgx/cohort-2/moodify/posters/Ye_Bikhra_Hai_Saaman__DOWNLOAD_MING__rgLy7ek54.jpeg",
        "title": "Ye Bikhra Hai Saaman [DOWNLOAD MING]",
        "mood": "happy",
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{loading, setLoading, song, setSong}}>
            {children}
        </SongContext.Provider>
    )
}