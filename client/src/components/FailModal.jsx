import classnames from "classnames";

/**
 * @typedef FailModalProps
 * @property {Boolean} hide
 * @property {Function} setClose
 * @property {JSX.Element} children
 */

/**
 * 
 * @param {FailModalProps} props 
 * @returns 
 */
export default function (props) {
    return (
        <div className={classnames({
            "message": true,
            "hide": props.hide
        })}>
            {props.children}
            <span className="close" onClick={()=>props.setClose(false)}>&times;</span>
        </div>
    )
}