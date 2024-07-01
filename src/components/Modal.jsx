import ReactDom from "react-dom"
export default function Modal({ open, onClose, successModal }) {
    // console.log(onClose)
    const styles = {
        position: 'fixed',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#FFF",
        padding: "50px",
        zIndex: 1000
    }
    const OVERLAY_STYLES = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,.7)",
        zIndex: 1000,
        // overflow: "hidden"
    }
    if(!open)
        return null
    return (
        <>
            <div style={OVERLAY_STYLES}/>
            <div style={styles}>
                <p>Add Player to Team?</p>
                <button onClick={successModal}>Ok</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </>)
}