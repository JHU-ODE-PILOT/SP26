let activeLink;

if (pageName === "Home" || pageCate === "Home") {
    activeLink = document.getElementById("home");
}
if (pageName === "Problem Sets" || pageCate === "PSets") {
    activeLink = document.getElementById("psets");
}
if (pageName === "Resources" || pageCate === "Resources") {
    activeLink = document.getElementById("resources");
}
if (pageName === "Contacts"  || pageCate === "Contacts") {
    activeLink = document.getElementById("contacts");
}
if (activeLink) {
    activeLink.classList.add("active");
}