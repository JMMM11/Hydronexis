/* =========================================================
   TEMPORARY HYDROCHAT SESSION TEST
========================================================= */

const hydroChatSession = {
    user: {
        uid: "test-user"
    }
};

console.log("HydroChat JS loaded correctly");


/* =========================================================
   SELLERS
========================================================= */

const hydroChatSellers = [

    /* =====================================================
       CHIVES
    ====================================================== */

    {
        id: "chives-pedro-gomez",

        seller: "Pedro Gomez",

        product: "Chives",

        productDisplay:
            "Chives",

        price:
            0.35,

        category:
            "herbs",

        image:
            "images/chives.png",

        firstMessage:
            "Hi! I have fresh chives available for $0.35 per pound. The price can be negotiated depending on the quantity. How can I help you?"
    },


    {
        id: "chives-ana-lopez",

        seller: "Ana Lopez",

        product: "Chives",

        productDisplay:
            "Chives",

        price:
            0.30,

        category:
            "herbs",

        image:
            "images/chives.png",

        firstMessage:
            "Hello! I'm selling fresh chives for $0.30 per pound. Let me know how many pounds you need and we can discuss it."
    },


    {
        id: "chives-miguel-santos",

        seller: "Miguel Santos",

        product: "Chives",

        productDisplay:
            "Chives",

        price:
            0.28,

        category:
            "herbs",

        image:
            "images/chives.png",

        firstMessage:
            "Hi! Chives are currently available at $0.28 per pound. If you're interested, tell me the quantity you're looking for."
    },



    /* =====================================================
       SPINACH
    ====================================================== */

    {
        id: "spinach-elena-castro",

        seller: "Elena Castro",

        product: "Spinach",

        productDisplay:
            "Spinach",

        price:
            3.10,

        category:
            "vegetables",

        image:
            "images/spinach.png",

        firstMessage:
            "Hello! I currently have fresh spinach available for $3.10 per pound. Feel free to ask me about availability or quantity."
    },


    {
        id: "spinach-ricardo-pena",

        seller: "Ricardo Peña",

        product: "Spinach",

        productDisplay:
            "Spinach",

        price:
            2.95,

        category:
            "vegetables",

        image:
            "images/spinach.png",

        firstMessage:
            "Hi! I'm selling spinach for $2.95 per pound. If you need several pounds, we can talk about the price."
    },


    {
        id: "spinach-sofia-ramirez",

        seller: "Sofia Ramirez",

        product: "Spinach",

        productDisplay:
            "Spinach",

        price:
            2.80,

        category:
            "vegetables",

        image:
            "images/spinach.png",

        firstMessage:
            "Hello! Fresh spinach is available at $2.80 per pound. Let me know how much you need and I'll be happy to help."
    },



    /* =====================================================
       ROMAINE LETTUCE
    ====================================================== */

    {
        id: "romaine-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Romaine Lettuce",

        productDisplay:
            "Romaine Lettuce",

        price:
            0.75,

        category:
            "vegetables",

        image:
            "images/romaine-lettuce.png",

        firstMessage:
            "Hi! I have Romaine lettuce available for $0.75 per pound. The price may be negotiable depending on the amount you need."
    },


    {
        id: "romaine-maria-rodriguez",

        seller: "Maria Rodriguez",

        product: "Romaine Lettuce",

        productDisplay:
            "Romaine Lettuce",

        price:
            0.60,

        category:
            "vegetables",

        image:
            "images/romaine-lettuce.png",

        firstMessage:
            "Hello! I'm currently selling fresh Romaine lettuce for $0.60 per pound. How many pounds are you looking for?"
    },


    {
        id: "romaine-jose-hernandez",

        seller: "Jose Hernandez",

        product: "Romaine Lettuce",

        productDisplay:
            "Romaine Lettuce",

        price:
            0.55,

        category:
            "vegetables",

        image:
            "images/romaine-lettuce.png",

        firstMessage:
            "Hi! Romaine lettuce is available at $0.55 per pound. Let me know the quantity you're interested in."
    },



    /* =====================================================
       BUTTERHEAD LETTUCE
    ====================================================== */

    {
        id: "butterhead-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Butterhead Lettuce",

        productDisplay:
            "Butterhead Lettuce",

        price:
            0.75,

        category:
            "vegetables",

        image:
            "images/butterhead-lettuce.png",

        firstMessage:
            "Hello! I also have Butterhead lettuce available for $0.75 per pound. Let me know what quantity you're looking for."
    },


    {
        id: "butterhead-patricia-nunez",

        seller: "Patricia Nuñez",

        product: "Butterhead Lettuce",

        productDisplay:
            "Butterhead Lettuce",

        price:
            0.65,

        category:
            "vegetables",

        image:
            "images/butterhead-lettuce.png",

        firstMessage:
            "Hi! Fresh Butterhead lettuce is available for $0.65 per pound. The price can be discussed depending on your order."
    },


    {
        id: "butterhead-fernando-cruz",

        seller: "Fernando Cruz",

        product: "Butterhead Lettuce",

        productDisplay:
            "Butterhead Lettuce",

        price:
            0.58,

        category:
            "vegetables",

        image:
            "images/butterhead-lettuce.png",

        firstMessage:
            "Hello! I'm selling Butterhead lettuce for $0.58 per pound. Tell me how much you need and I'll help you with availability."
    },



    /* =====================================================
       GREEN BELL PEPPERS
    ====================================================== */

    {
        id: "green-pepper-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Green Bell Peppers",

        productDisplay:
            "Green Bell Peppers",

        price:
            2.05,

        category:
            "vegetables",

        image:
            "images/green-pepper.png",

        firstMessage:
            "Hi! Green bell peppers are available for $2.05 per pound. If you're buying several pounds, we can discuss the price."
    },


    {
        id: "green-pepper-beatriz-campos",

        seller: "Beatriz Campos",

        product: "Green Bell Peppers",

        productDisplay:
            "Green Bell Peppers",

        price:
            2.00,

        category:
            "vegetables",

        image:
            "images/green-pepper.png",

        firstMessage:
            "Hello! I'm selling fresh green bell peppers for $2.00 per pound. Let me know the amount you're interested in."
    },


    {
        id: "green-pepper-edgar-wong",

        seller: "Edgar Wong",

        product: "Green Bell Peppers",

        productDisplay:
            "Green Bell Peppers",

        price:
            1.80,

        category:
            "vegetables",

        image:
            "images/green-pepper.png",

        firstMessage:
            "Hi! I currently have green bell peppers available at $1.80 per pound. How can I help you?"
    },



    /* =====================================================
       YELLOW BELL PEPPERS
    ====================================================== */

    {
        id: "yellow-pepper-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Yellow Bell Peppers",

        productDisplay:
            "Yellow Bell Peppers",

        price:
            2.10,

        category:
            "vegetables",

        image:
            "images/yellow-pepper.png",

        firstMessage:
            "Hello! Yellow bell peppers are available for $2.10 per pound. Let me know how many pounds you need."
    },


    {
        id: "yellow-pepper-monica-rivera",

        seller: "Monica Rivera",

        product: "Yellow Bell Peppers",

        productDisplay:
            "Yellow Bell Peppers",

        price:
            2.00,

        category:
            "vegetables",

        image:
            "images/yellow-pepper.png",

        firstMessage:
            "Hi! I'm selling yellow bell peppers for $2.00 per pound. We can discuss the price depending on quantity."
    },


    {
        id: "yellow-pepper-hector-davila",

        seller: "Hector Davila",

        product: "Yellow Bell Peppers",

        productDisplay:
            "Yellow Bell Peppers",

        price:
            1.85,

        category:
            "vegetables",

        image:
            "images/yellow-pepper.png",

        firstMessage:
            "Hello! Fresh yellow bell peppers are available at $1.85 per pound. Let me know if you're interested."
    },



    /* =====================================================
       RED BELL PEPPERS
    ====================================================== */

    {
        id: "red-pepper-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Red Bell Peppers",

        productDisplay:
            "Red Bell Peppers",

        price:
            2.15,

        category:
            "vegetables",

        image:
            "images/red-pepper.png",

        firstMessage:
            "Hi! I have red bell peppers available for $2.15 per pound. Let me know the quantity you need."
    },


    {
        id: "red-pepper-gloria-aguilar",

        seller: "Gloria Aguilar",

        product: "Red Bell Peppers",

        productDisplay:
            "Red Bell Peppers",

        price:
            2.00,

        category:
            "vegetables",

        image:
            "images/red-pepper.png",

        firstMessage:
            "Hello! I'm currently selling red bell peppers for $2.00 per pound. The price can be discussed for larger orders."
    },



    /* =====================================================
       RADISH
    ====================================================== */

    {
        id: "radish-jorge-mendez",

        seller: "Jorge Mendez",

        product: "Radish",

        productDisplay:
            "Radish",

        price:
            0.70,

        category:
            "vegetables",

        image:
            "images/radish.png",

        firstMessage:
            "Hi! Fresh radishes are available for $0.70 per pound. Tell me how much you're looking for and I'll check availability."
    },


    {
        id: "radish-diana-flores",

        seller: "Diana Flores",

        product: "Radish",

        productDisplay:
            "Radish",

        price:
            0.65,

        category:
            "vegetables",

        image:
            "images/radish.png",

        firstMessage:
            "Hello! I'm selling fresh radishes for $0.65 per pound. Feel free to ask about quantity or price."
    },


    {
        id: "radish-raul-espinoza",

        seller: "Raul Espinoza",

        product: "Radish",

        productDisplay:
            "Radish",

        price:
            0.60,

        category:
            "vegetables",

        image:
            "images/radish.png",

        firstMessage:
            "Hi! Radishes are currently available for $0.60 per pound. Let me know if you'd like to place an order."
    },



    /* =====================================================
       TOMATOES
    ====================================================== */

    {
        id: "tomatoes-alberto-martinez",

        seller: "Alberto Martinez",

        product: "Tomatoes",

        productDisplay:
            "Tomatoes",

        price:
            1.25,

        category:
            "vegetables",

        image:
            "images/tomato.png",

        firstMessage:
            "Hello! Fresh tomatoes are available for $1.25 per pound. The price may be negotiable depending on quantity."
    },


    {
        id: "tomatoes-carmen-vega",

        seller: "Carmen Vega",

        product: "Tomatoes",

        productDisplay:
            "Tomatoes",

        price:
            1.15,

        category:
            "vegetables",

        image:
            "images/tomato.png",

        firstMessage:
            "Hi! I'm selling tomatoes for $1.15 per pound. Tell me how many pounds you're interested in and I'll help you."
    },


    {
        id: "tomatoes-luis-morales",

        seller: "Luis Morales",

        product: "Tomatoes",

        productDisplay:
            "Tomatoes",

        price:
            1.05,

        category:
            "vegetables",

        image:
            "images/tomato.png",

        firstMessage:
            "Hello! I currently have tomatoes available at $1.05 per pound. Let me know the quantity you're looking for."
    }

];



/* =========================================================
   DOM ELEMENTS
========================================================= */

const hydrochatApp =
    document.querySelector(
        ".hydrochat-app"
    );


const contactList =
    document.getElementById(
        "chatContactList"
    );


const chatSearch =
    document.getElementById(
        "chatSearch"
    );


const chatFilters =
    document.querySelectorAll(
        ".hydrochat-filter"
    );


const chatCount =
    document.getElementById(
        "chatCount"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const activeChatElement =
    document.getElementById(
        "activeChat"
    );


const conversationSeller =
    document.getElementById(
        "conversationSeller"
    );


const conversationProduct =
    document.getElementById(
        "conversationProduct"
    );


const conversationPrice =
    document.getElementById(
        "conversationPrice"
    );


const conversationAvatarImage =
    document.getElementById(
        "conversationAvatarImage"
    );


const conversationAvatarFallback =
    document.getElementById(
        "conversationAvatarFallback"
    );


const conversationMessages =
    document.getElementById(
        "conversationMessages"
    );


const messageForm =
    document.getElementById(
        "messageForm"
    );


const messageInput =
    document.getElementById(
        "messageInput"
    );


const conversationBack =
    document.getElementById(
        "conversationBack"
    );



/* =========================================================
   STATE
========================================================= */

let activeSellerId = null;

let activeFilter = "all";

let searchValue = "";



/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
    `hydronexis-hydrochat-messages.${hydroChatSession.user?.uid || "guest"}`;


function loadStoredMessages() {

    try {

        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!stored) {

            return {};

        }


        return JSON.parse(stored);

    }

    catch (error) {

        console.warn(
            "HydroChat storage could not be loaded.",
            error
        );


        return {};

    }

}


let storedMessages =
    loadStoredMessages();



function saveStoredMessages() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                storedMessages
            )
        );

    }

    catch (error) {

        console.warn(
            "HydroChat storage could not be saved.",
            error
        );

    }

}



/* =========================================================
   HELPERS
========================================================= */

function normalizeText(value) {

    return String(value)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}



function formatPrice(price) {

    return `$${Number(price).toFixed(2)}/lb`;

}



function getInitials(name) {

    const parts =
        name.trim().split(/\s+/);


    if (parts.length === 1) {

        return parts[0]
            .slice(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}



function currentTime() {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour:
                "numeric",

            minute:
                "2-digit"
        }
    ).format(
        new Date()
    );

}



/* =========================================================
   GET CHAT MESSAGES
========================================================= */

function getMessagesForSeller(
    seller
) {

    const saved =
        storedMessages[
            seller.id
        ];


    if (
        Array.isArray(saved) &&
        saved.length > 0
    ) {

        return saved;

    }


    return [

        {
            type:
                "received",

            text:
                seller.firstMessage,

            time:
                "Now"
        }

    ];

}



/* =========================================================
   CREATE AVATAR
========================================================= */

function createAvatar(
    seller,
    className
) {

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        className;


    const fallback =
        document.createElement(
            "span"
        );


    fallback.textContent =
        getInitials(
            seller.seller
        );


    const image =
        document.createElement(
            "img"
        );


    image.src =
        seller.image || "";


    image.alt =
        seller.product;


    image.addEventListener(
        "error",
        () => {

            image.style.display =
                "none";

        }
    );


    avatar.appendChild(
        fallback
    );


    if (seller.image) {

        avatar.appendChild(
            image
        );

    }


    return avatar;

}



/* =========================================================
   LAST MESSAGE
========================================================= */

function getLastMessage(
    seller
) {

    const messages =
        getMessagesForSeller(
            seller
        );


    return messages[
        messages.length - 1
    ];

}



/* =========================================================
   CREATE CONTACT
========================================================= */

function createContact(
    seller
) {

    const contact =
        document.createElement(
            "button"
        );


    contact.type =
        "button";


    contact.className =
        "chat-contact";


    contact.dataset.sellerId =
        seller.id;


    if (
        activeSellerId ===
        seller.id
    ) {

        contact.classList.add(
            "active"
        );

    }


    const avatar =
        createAvatar(
            seller,
            "contact-avatar"
        );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "contact-content";


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "contact-heading";


    const sellerName =
        document.createElement(
            "h3"
        );


    sellerName.textContent =
        seller.seller;


    const lastMessage =
        getLastMessage(
            seller
        );


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "contact-time";


    time.textContent =
        lastMessage.time;


    heading.appendChild(
        sellerName
    );


    heading.appendChild(
        time
    );


    const product =
        document.createElement(
            "p"
        );


    product.className =
        "contact-product";


    product.textContent =
        seller.product;


    const previewRow =
        document.createElement(
            "div"
        );


    previewRow.className =
        "contact-preview-row";


    const preview =
        document.createElement(
            "p"
        );


    preview.className =
        "contact-preview";


    preview.textContent =
        lastMessage.text;


    const price =
        document.createElement(
            "span"
        );


    price.className =
        "contact-price";


    price.textContent =
        formatPrice(
            seller.price
        );


    previewRow.appendChild(
        preview
    );


    previewRow.appendChild(
        price
    );


    content.appendChild(
        heading
    );


    content.appendChild(
        product
    );


    content.appendChild(
        previewRow
    );


    contact.appendChild(
        avatar
    );


    contact.appendChild(
        content
    );


    contact.addEventListener(
        "click",
        () => {

            openConversation(
                seller.id
            );

        }
    );


    return contact;

}



/* =========================================================
   FILTER SELLERS
========================================================= */

function getFilteredSellers() {

    return hydroChatSellers.filter(
        seller => {

            const filterMatches =

                activeFilter ===
                "all"

                ||

                seller.category ===
                activeFilter;


            const searchText =
                normalizeText(`

                    ${seller.seller}

                    ${seller.product}

                    ${seller.productDisplay}

                    ${seller.price}

                `);


            const searchMatches =

                !searchValue

                ||

                searchText.includes(
                    normalizeText(
                        searchValue
                    )
                );


            return (
                filterMatches &&
                searchMatches
            );

        }
    );

}



/* =========================================================
   RENDER CONTACTS
========================================================= */

function renderContacts() {

    contactList.innerHTML =
        "";


    const filtered =
        getFilteredSellers();


    chatCount.textContent =
        filtered.length;


    if (
        filtered.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "no-chat-results";


        empty.textContent =
            "No sellers or products found.";


        contactList.appendChild(
            empty
        );


        return;

    }


    filtered.forEach(
        seller => {

            contactList.appendChild(
                createContact(
                    seller
                )
            );

        }
    );

}



/* =========================================================
   CREATE MESSAGE ELEMENT
========================================================= */

function createMessageElement(
    message
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        `message-row ${message.type}`;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "chat-message-bubble";


    const text =
        document.createElement(
            "p"
        );


    text.textContent =
        message.text;


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "message-time";


    time.textContent =
        message.time;


    bubble.appendChild(
        text
    );


    bubble.appendChild(
        time
    );


    row.appendChild(
        bubble
    );


    return row;

}



/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages(
    seller
) {

    conversationMessages.innerHTML =
        "";


    const date =
        document.createElement(
            "div"
        );


    date.className =
        "chat-date-chip";


    date.textContent =
        "Today";


    conversationMessages.appendChild(
        date
    );


    const messages =
        getMessagesForSeller(
            seller
        );


    messages.forEach(
        message => {

            conversationMessages
                .appendChild(
                    createMessageElement(
                        message
                    )
                );

        }
    );


    requestAnimationFrame(
        () => {

            conversationMessages
                .scrollTop =
                conversationMessages
                    .scrollHeight;

        }
    );

}



/* =========================================================
   OPEN CONVERSATION
========================================================= */

function openConversation(
    sellerId
) {

    const seller =
        hydroChatSellers.find(
            item =>
                item.id === sellerId
        );


    if (!seller) {

        return;

    }


    activeSellerId =
        seller.id;


    emptyState.style.display =
        "none";


    activeChatElement.hidden =
        false;


    conversationSeller.textContent =
        seller.seller;


    conversationProduct.textContent =
        seller.product;


    conversationPrice.textContent =
        formatPrice(
            seller.price
        );


    conversationAvatarFallback
        .textContent =
        getInitials(
            seller.seller
        );


    conversationAvatarImage.style.display =
        seller.image ? "block" : "none";


    conversationAvatarImage.src =
        seller.image;


    conversationAvatarImage.alt =
        seller.product;


    conversationAvatarImage.onerror =
        () => {

            conversationAvatarImage
                .style.display =
                "none";

        };


    renderMessages(
        seller
    );


    renderContacts();


    hydrochatApp.classList.add(
        "mobile-chat-open"
    );


    setTimeout(
        () => {

            messageInput.focus();

        },
        100
    );

}



/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

    if (!activeSellerId) {

        return;

    }


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    const seller =
        hydroChatSellers.find(
            item =>
                item.id ===
                activeSellerId
        );


    if (!seller) {

        return;

    }


    const currentMessages =
        getMessagesForSeller(
            seller
        );


    const newMessage = {

        type:
            "sent",

        text:
            text,

        time:
            currentTime()

    };


    const updatedMessages = [

        ...currentMessages,

        newMessage

    ];


    storedMessages[
        seller.id
    ] =
        updatedMessages;


    saveStoredMessages();


    messageInput.value =
        "";


    resetTextareaHeight();


    renderMessages(
        seller
    );


    renderContacts();

}



/* =========================================================
   FORM SUBMIT
========================================================= */

messageForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendMessage();

    }
);



/* =========================================================
   ENTER TO SEND
   SHIFT + ENTER = NEW LINE
========================================================= */

messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"

            &&

            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);



/* =========================================================
   AUTO RESIZE TEXTAREA
========================================================= */

function resetTextareaHeight() {

    messageInput.style.height =
        "38px";

}


messageInput.addEventListener(
    "input",
    () => {

        messageInput.style.height =
            "38px";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                110
            ) + "px";

    }
);



/* =========================================================
   SEARCH
========================================================= */

chatSearch.addEventListener(
    "input",
    event => {

        searchValue =
            event.target.value;


        renderContacts();

    }
);



/* =========================================================
   FILTERS
========================================================= */

chatFilters.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                activeFilter =
                    button.dataset.filter;


                chatFilters.forEach(
                    filterButton => {

                        filterButton
                            .classList
                            .remove(
                                "active"
                            );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderContacts();

            }
        );

    }
);



/* =========================================================
   MOBILE BACK BUTTON
========================================================= */

conversationBack.addEventListener(
    "click",
    () => {

        hydrochatApp.classList.remove(
            "mobile-chat-open"
        );


        messageInput.blur();

    }
);



/* =========================================================
   ESCAPE RETURNS TO LIST ON MOBILE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            hydrochatApp.classList.remove(
                "mobile-chat-open"
            );

        }

    }
);



/* =========================================================
   INITIALIZE
========================================================= */

function initializeHydroChat() {

    /*
        On desktop we open the first seller automatically.

        On mobile we keep the contact list visible first,
        similar to WhatsApp.
    */

    const query = new URLSearchParams(window.location.search);
    const requestedSeller = query.get("seller");
    const requestedProduct = query.get("product");
    let requestedConversation = hydroChatSellers.find(item =>
        item.id === requestedSeller ||
        item.id === `${requestedProduct}-${requestedSeller}` ||
        (item.product === requestedProduct && item.id.includes(requestedSeller || ""))
    );

    if (requestedConversation) {
        requestedConversation = {
            ...requestedConversation,
            seller: query.get("sellerName") || requestedConversation.seller,
            product: query.get("productName") || requestedConversation.product,
            productDisplay: query.get("productName") || requestedConversation.productDisplay,
            price: Number.isFinite(Number(query.get("price")))
                ? Number(query.get("price"))
                : requestedConversation.price
        };
    }

    if (!requestedConversation && requestedSeller && requestedProduct) {

        const productName = query.get("productName") || "Marketplace product";
        const sellerName = query.get("sellerName") || "Marketplace seller";
        const requestedPrice = Number(query.get("price"));
        const dynamicConversation = {
            id: `marketplace-${requestedProduct}-${requestedSeller}`.slice(0, 240),
            seller: sellerName,
            product: productName,
            productDisplay: productName,
            price: Number.isFinite(requestedPrice) ? requestedPrice : 0,
            category: "all",
            image: "",
            firstMessage: "This conversation was opened from the Marketplace. Messages are saved only on this device until the secure messaging backend is connected."
        };

        hydroChatSellers.unshift(dynamicConversation);
        requestedConversation = dynamicConversation;

    }

    renderContacts();

    if (requestedConversation) {
        openConversation(requestedConversation.id);
    } else if (
        window.innerWidth >
        700
    ) {

        openConversation(
            hydroChatSellers[0].id
        );

    }

}



initializeHydroChat();
