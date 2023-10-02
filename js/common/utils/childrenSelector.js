import $ from "jquery";

const childrenSelect = (parent) => {
    return (child) => $(parent).find(child);
}

export { childrenSelect };