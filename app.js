var content = [
    {
        title: "Mix",
        description: "Juegos para PC y celulares",
        items: [
            {
                name: "GTA VI port",
                tag: "EXPERIMENTAL",
                downloads: [
                    {
                        text: "DESCARGAR GTA VI PORT",
                        link: "https://github.com/Knockdude/Leonida-X"
                    }
                ]
            },
            {
                name: "GTA VI Mobile",
                tag: "PROXIMAMENTE EN ANDROID",
                downloads: [
                    {
                        text: "NO DISPONIBLE (por el instante instantoso)",
                        link: ""
                    }
                ]
            },
            {
                name: "GTA VI ps3",
                tag: "PROXIMAMENTE PARA PS3",
                downloads: [
                    {
                        text: "NO DISPONIBLE (por ahora)",
                        link: ""
                    }
                ]
            },
            {
                name: "GTA VI PS4",
                tag: "PROXIMAMENTE PARA PS4",
                downloads: [
                    {
                        text: "NO DISPONIBLE (por el moment momentoso)",
                        link: ""
                    }
                ]
            }
        ]
    },
    {
        title: "Celulares",
        description: "Juegos y aplicaciones para celulares",
        items: [
            {
                name: "GTA VI Mobile",
                tag: "PROXIMAMENTE EN ANDROID",
                downloads: [
                    {
                        text: "NO DISPONIBLE",
                        link: ""
                    }
                ]
            }
        ]
    }
];

var defaultCategory = 0;

var mainContainer = document.querySelector("main");
var categoryContainer = document.querySelector("ul.categories");
var itemContainer = document.querySelector("ul.items");
var buttonContainer = document.querySelector("div.downloadButtons");
var downloadsContainer = document.querySelector("section.downloads");
var categoryDescription = document.querySelector(".boxTitle span");
var searchBox = document.getElementById("optiSearch");

var currentCategory = undefined;
var previousCategory = defaultCategory;
var selectedItem = undefined;
var renderedItems = [];
var renderedElements = [];
var searchTimer = null;
var lastSearchValue = "";

function childIndex(parent, child) {
    for (; child && child.parentNode !== parent;) {
        child = child.parentNode;
    }

    if (!child) return -1;

    var children = parent.children;

    for (var i = 0; i < children.length; i++) {
        if (children[i] === child) return i;
    }

    return -1;
}

function createCategories() {
    if (!categoryContainer || !content.length) return;

    categoryContainer.innerHTML = "";

    var fragment = document.createDocumentFragment();

    for (var t = 0; t < content.length; t++) {
        var li = document.createElement("li");
        li.textContent = content[t].title;
        fragment.appendChild(li);
    }

    categoryContainer.appendChild(fragment);
}

function changeCategory(idx) {
    if (!content[idx] || !categoryContainer || !itemContainer) return;

    if (idx === currentCategory) return;

    clearTimeout(searchTimer);

    if (searchBox) searchBox.value = "";

    lastSearchValue = "";

    itemContainer.innerHTML = "";

    if (categoryContainer.children[idx]) {
        categoryContainer.children[idx].classList.add("selected");
    }

    if (
        currentCategory !== undefined &&
        categoryContainer.children[currentCategory]
    ) {
        categoryContainer.children[currentCategory].classList.remove("selected");
    }

    if (categoryDescription) {
        categoryDescription.textContent = content[idx].description;
    }

    currentCategory = idx;
    selectedItem = undefined;

    createItems(content[idx].items);

    if (renderedItems.length > 0) {
        selectItem(renderedItems[0], 0);
    } else if (downloadsContainer) {
        downloadsContainer.style.display = "none";
    }
}

function addTag(element, text, className) {
    var span = document.createElement("span");
    span.textContent = text;
    span.className = className;
    element.appendChild(span);
}

function buildItemLi(item) {
    var li = document.createElement("li");

    var span = document.createElement("span");
    span.className = "name";
    span.textContent = item.name;

    li.appendChild(span);

    if (item.tag !== undefined) {
        addTag(li, item.tag, "tag");
    }

    var index = renderedItems.length;

    renderedItems.push(item);
    renderedElements.push(li);

    li.addEventListener("click", function() {
        selectItem(item, index);
    });

    return li;
}

function createItems(items) {
    renderedItems = [];
    renderedElements = [];
    selectedItem = undefined;

    if (!itemContainer) return;

    itemContainer.innerHTML = "";

    if (!items || !items.length) return;

    var fragment = document.createDocumentFragment();

    for (var t = 0; t < items.length; t++) {
        fragment.appendChild(buildItemLi(items[t]));
    }

    itemContainer.appendChild(fragment);
}


function createButton(text, link) {
    var btn = document.createElement("a");

    btn.textContent = text || "Descargar";

    if (link) {
        btn.href = link;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
    } else {
        btn.className = "placeholder";
    }

    return btn;
}

function selectItem(item, idx) {
    if (!item || !buttonContainer) return;
    if (idx === selectedItem) return;

    // Solo se vacía el contenedor de botones, no toda la sección
    buttonContainer.innerHTML = "";

    if (downloadsContainer) {
        downloadsContainer.style.display = "";
    }

    if (selectedItem !== undefined && renderedElements[selectedItem]) {
        renderedElements[selectedItem].classList.remove("selected");
    }

    if (renderedElements[idx]) {
        renderedElements[idx].classList.add("selected");
    }

    // Botón principal
    if (item.link) {
        buttonContainer.appendChild(createButton(item.buttonText, item.link));
    }

    // Descargas adicionales
    (item.downloads || []).forEach(function(download) {
        buttonContainer.appendChild(createButton(download.text, download.link));
    });

    if (!buttonContainer.children.length) {
        buttonContainer.appendChild(createButton("NO DISPONIBLE", ""));
    }

    selectedItem = idx;
}

function search(query) {
    if (!itemContainer) return;

    query = query.toLowerCase().trim();

    itemContainer.innerHTML = "";
    selectedItem = undefined;

    // Al buscar no hay ninguna categoría activa
    if (currentCategory !== undefined) {
        previousCategory = currentCategory;
        currentCategory = undefined;
    }

    Array.from(categoryContainer.children).forEach(function(element) {
        element.classList.remove("selected");
    });

    var filtered = [];
    var seen = new Set();

    for (var i = 0; i < content.length; i++) {
        for (var j = 0; j < content[i].items.length; j++) {
            var item = content[i].items[j];

            if (
                !seen.has(item.name) &&
                (item.name.toLowerCase().indexOf(query) !== -1 ||
                (item.tag && item.tag.toLowerCase().indexOf(query) !== -1))
            ) {
                seen.add(item.name);
                filtered.push(item);
            }
        }
    }

    if (filtered.length) {
        if (categoryDescription) {
            categoryDescription.textContent = "Búsqueda";
        }

        createItems(filtered);
        selectItem(renderedItems[0], 0);
    } else {
        if (categoryDescription) {
            categoryDescription.textContent = "Búsqueda - Sin resultados";
        }

        renderedItems = [];
        renderedElements = [];

        if (downloadsContainer) {
            downloadsContainer.style.display = "none";
        }

        if (buttonContainer) {
            buttonContainer.innerHTML = "";
        }
    }
}

function onSearchInput() {
    if (!searchBox) return;

    if (searchBox.value === lastSearchValue) return;

    clearTimeout(searchTimer);

    searchTimer = setTimeout(function() {
        var query = searchBox.value.trim();

        lastSearchValue = searchBox.value;

        if (query !== "") {
            search(query);
        } else if (currentCategory === undefined) {
            changeCategory(previousCategory);
        }
    }, 150);
}

function closeOverlay() {
    var overlay = document.getElementById("overlay");

    if (overlay) {
        overlay.style.display = "none";
    }
}

if (categoryContainer && itemContainer && buttonContainer) {

    createCategories();

    categoryContainer.addEventListener("click", function(e) {
        var idx = childIndex(categoryContainer, e.target);

        if (idx !== -1) {
            changeCategory(idx);
        }
    });

    if (searchBox) {
        searchBox.value = "";
        searchBox.addEventListener("input", onSearchInput);
    }

    changeCategory(defaultCategory);
}

var dmcaLink = document.getElementById("dmcaLink");

if (dmcaLink) {
    dmcaLink.addEventListener("click", function(e) {
        e.preventDefault();
        alert("DMCA: consultasopti@gmail.com");
    });
}
