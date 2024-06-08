import { useEffect } from "react"
import { DarkMode } from "../../../shared/components/icons"
import { useLocalStorage } from "react-use"


const darkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode' , false)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    } , [isDarkMode])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }
  return (
    <div className="cursor-pointer" onClick={toggleDarkMode}>
        <DarkMode/>
    </div>
  )
}

export default darkModeToggle