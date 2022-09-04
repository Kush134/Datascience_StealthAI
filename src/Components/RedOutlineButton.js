import React from "react";

export const RedOutlineButton = (props) => <button className="button button-v3" type="submit"
                                                   onClick={props.onClick}>{props.children}</button>;