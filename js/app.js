"use strict";


/* ==================================================
   DOM
================================================== */

const coverCanvas =
    document.getElementById("cover-canvas");

const canvasWrapper =
    document.getElementById("canvas-wrapper");

const background =
    document.getElementById("canvas-background");

const stepButtons =
    document.querySelectorAll(".step-button");

const step1Panel =
    document.getElementById("step-1-panel");

const editorScreen =
    document.getElementById("editor-screen");

const sizeCards =
    document.querySelectorAll(".size-card");

const selectedSizeInfo =
    document.getElementById("selected-size-info");

const customSizeButton =
    document.getElementById("custom-size-button");

const customSizeModal =
    document.getElementById("custom-size-modal");

const customWidth =
    document.getElementById("custom-width");

const customHeight =
    document.getElementById("custom-height");

const customUnit =
    document.getElementById("custom-unit");

const customCancel =
    document.getElementById("custom-cancel");

const customConfirm =
    document.getElementById("custom-confirm");

const toStep2 =
    document.getElementById("to-step-2");

const modeButtons =
    document.querySelectorAll(".mode-button");

const templateContent =
    document.getElementById("template-content");

const partsContent =
    document.getElementById("parts-content");

const templateOptions =
    document.getElementById("template-options");

const frameCategories =
    document.querySelectorAll(".frame-category");

const frameOptions =
    document.getElementById("frame-options");

const layerList =
    document.getElementById("layer-list");

const floatingToolbar =
    document.getElementById("floating-toolbar");

const objectProperties =
    document.getElementById("object-properties");

const framePanel =
    document.getElementById("frame-panel");

const backgroundPanel =
    document.getElementById("background-panel");

const titlePanel =
    document.getElementById("title-panel");

const finishPanel =
    document.getElementById("finish-panel");

const exportPanel =
    document.getElementById("export-panel");

const exportPngButton =
    document.getElementById("export-png-button");

const saveProjectButton =
    document.getElementById("save-project-button");

const resetProjectButton =
    document.getElementById("reset-project-button");

const loadProjectInput =
    document.getElementById("load-project-input");

const backgroundTypeButtons =
    document.querySelectorAll(".background-type-button");

const backgroundColorInput =
    document.getElementById("background-color");

const gradientColor1Input =
    document.getElementById("gradient-color-1");

const gradientColor2Input =
    document.getElementById("gradient-color-2");

const gradientAngleInput =
    document.getElementById("gradient-angle");

const gradientAngleValue =
    document.getElementById("gradient-angle-value");

const backgroundImageInput =
    document.getElementById("background-image");

const backgroundMaterialGrid =
    document.getElementById("background-material-grid");

const backgroundLoadMoreButton =
    document.getElementById("background-load-more");

/* ==================================================
   REGISTERED BACKGROUND MATERIALS
================================================== */

let currentBackgroundCategory = "ziburi";
let backgroundMaterialVisibleCount = 24;

const backgroundCategoryNames = {
    ziburi: "ジブリ",
    anime: "アニメ・漫画",
    art: "絵画",
    picture: "写真",
    texture: "テクスチャ",
    other: "その他"
};

function renderBackgroundCategories() {
    const container = document.getElementById(
        "background-category-list"
    );

    if (!container) return;

    container.innerHTML = "";

    Object.keys(backgroundMaterials).forEach(category => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "background-category-button";

        if (category === currentBackgroundCategory) {
            button.classList.add("active");
        }

        button.textContent =
            backgroundCategoryNames[category] || category;

        button.addEventListener("click", () => {
            currentBackgroundCategory = category;
            backgroundMaterialVisibleCount = 24;

            renderBackgroundCategories();
            renderBackgroundMaterials();
        });

        container.appendChild(button);
    });
}


function renderBackgroundMaterials() {
    if (!backgroundMaterialGrid) return;

    backgroundMaterialGrid.innerHTML = "";

    const materials =
        backgroundMaterials[currentBackgroundCategory] || [];

    if (materials.length === 0) {
        backgroundMaterialGrid.innerHTML =
            '<p class="empty-message">このカテゴリには背景素材がありません。</p>';

        if (backgroundLoadMoreButton) {
            backgroundLoadMoreButton.style.display = "none";
        }

        return;
    }

    const visibleMaterials =
        materials.slice(0, backgroundMaterialVisibleCount);

    visibleMaterials.forEach(material => {
        const button = document.createElement("button");

        button.type = "button";

        button.className = "background-material";

        if (
            state.background.image ===
            `assets/background/${getBackgroundFolderName(currentBackgroundCategory)}/${material.file}`
        ) {
            button.classList.add("selected");
        }

        const image = document.createElement("img");

        image.src =
            `assets/background/${getBackgroundFolderName(currentBackgroundCategory)}/${material.file}`;

        image.alt = material.name;
        image.loading = "lazy";

        button.appendChild(image);

       button.addEventListener("click", () => {

    const imagePath =
        `assets/background/${getBackgroundFolderName(currentBackgroundCategory)}/${material.file}`;

    const img = new Image();

    img.onload = () => {

        state.background.image = imagePath;

        // 元画像の縦横比
        state.background.imageAspectRatio =
            img.naturalWidth / img.naturalHeight;

        // 初期状態
        state.background.imageScale = 1;
        state.background.imageX = 0;
        state.background.imageY = 0;

        state.background.imageBrightness = 100;
        state.background.imageContrast = 100;
        state.background.imageSaturation = 100;
        state.background.imageSepia = 0;
        state.background.imageHue = 0;

        // 高さをノートに合わせたときの画像幅
        const initialHeight = state.notebook.height;
        const initialWidth =
            initialHeight *
            state.background.imageAspectRatio;

        // 横方向の中央
        state.background.imageX =
            (state.notebook.width - initialWidth) / 2;

        // 上端を合わせる
        state.background.imageY = 0;

        setBackgroundType("image");
        applyBackground();
        renderBackgroundMaterials();
        syncBackgroundControls();
    };

    img.src = imagePath;
});


        backgroundMaterialGrid.appendChild(button);
    });

    if (backgroundLoadMoreButton) {
        const hasMore =
            backgroundMaterialVisibleCount < materials.length;

        backgroundLoadMoreButton.style.display =
            hasMore ? "block" : "none";
    }
}


function getBackgroundFolderName(category) {
    const folders = {
        ziburi: "01ziburi",
        anime: "02anime",
        art: "03art",
        picture: "04picture",
        texture: "05texture",
        other: "06other"
    };

    return folders[category];
}


if (backgroundLoadMoreButton) {
    backgroundLoadMoreButton.addEventListener("click", () => {
        backgroundMaterialVisibleCount += 24;
        renderBackgroundMaterials();
    });
}


/* ==================================================
   STATE
================================================== */

const state = {

    currentStep: 1,

    notebook: {
        width: 148,
        height: 210,
        unit: "mm"
    },

    objects: [],

    background: {
    type: "color",
    color: "#FFFFFF",
    gradientColor1: "#FFFFFF",
    gradientColor2: "#E8E3D8",
    gradientAngle: 90,

   image: null,

    // 背景画像の元画像比率
    imageAspectRatio: null,

    // 背景画像の位置・大きさ
    imageX: 0,
    imageY: 0,
    imageScale: 1,

    // 背景画像の色調
    imageBrightness: 100,
    imageContrast: 100,
    imageSaturation: 100,
    imageSepia: 0,
    imageHue: 0

},

    selectedObjectId: null,

    history: [],

    historyIndex: -1

};


/* ==================================================
   SIZE
================================================== */

function setNotebookSize(
    width,
    height,
    unit = "mm"
) {

    width = Number(width);
    height = Number(height);

    if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0
    ) {
        return;
    }


    state.notebook.width = width;
    state.notebook.height = height;
    state.notebook.unit = unit;


    coverCanvas.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    background.setAttribute(
        "x",
        "0"
    );

    background.setAttribute(
        "y",
        "0"
    );

    background.setAttribute(
        "width",
        String(width)
    );

    background.setAttribute(
        "height",
        String(height)
    );


    canvasWrapper.style.aspectRatio =
        `${width} / ${height}`;


    selectedSizeInfo.textContent =
        `${width} × ${height} ${unit}`;


    /*
     * すでに配置されているオブジェクトは
     * そのまま残す。
     *
     * 今回はサイズ変更によって
     * オブジェクトを勝手に変形させない。
     */


    console.log(
        "Notebook size:",
        width,
        height,
        unit
    );

}


/* ==================================================
   SIZE CARD
================================================== */

sizeCards.forEach((card) => {

    if (
        card.id === "custom-size-button"
    ) {
        return;
    }


    card.addEventListener(
        "click",
        () => {

            const width =
                Number(card.dataset.width);

            const height =
                Number(card.dataset.height);

            const unit =
                card.dataset.unit || "mm";


            setNotebookSize(
                width,
                height,
                unit
            );


            sizeCards.forEach(
                (item) => {
                    item.classList.remove(
                        "selected"
                    );
                }
            );


            card.classList.add(
                "selected"
            );

        }
    );

});


/* ==================================================
   CUSTOM SIZE
================================================== */

customSizeButton.addEventListener(
    "click",
    () => {

        customWidth.value =
            state.notebook.width;

        customHeight.value =
            state.notebook.height;

        customUnit.value =
            state.notebook.unit;

        customSizeModal.classList.add(
            "active"
        );

    }
);


customCancel.addEventListener(
    "click",
    () => {

        customSizeModal.classList.remove(
            "active"
        );

    }
);


customConfirm.addEventListener(
    "click",
    () => {

        const width =
            Number(customWidth.value);

        const height =
            Number(customHeight.value);

        const unit =
            customUnit.value;


        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width <= 0 ||
            height <= 0
        ) {
            return;
        }


        setNotebookSize(
            width,
            height,
            unit
        );


        sizeCards.forEach(
            (item) => {
                item.classList.remove(
                    "selected"
                );
            }
        );


        customSizeModal.classList.remove(
            "active"
        );

    }
);


/* ==================================================
   STEP
================================================== */

function goToStep(step) {

    state.currentStep = Number(step);

    // =========================================
    // STEPボタンのactive切り替え
    // =========================================

    stepButtons.forEach((button) => {

        button.classList.toggle(
            "active",
            Number(button.dataset.step) ===
                state.currentStep
        );

    });


    // =========================================
    // すべてのSTEPパネルを非表示
    // =========================================

    if (step1Panel) {
        step1Panel.classList.remove("active");
    }

    if (framePanel) {
        framePanel.classList.remove("active");
    }

    if (backgroundPanel) {
        backgroundPanel.classList.remove("active");
    }

    if (titlePanel) {
        titlePanel.classList.remove("active");
    }

    if (finishPanel) {
        finishPanel.classList.remove("active");
    }

    if (exportPanel) {
    exportPanel.classList.remove("active");
}


    // =========================================
    // STEP 01
    // =========================================

    if (state.currentStep === 1) {

        if (step1Panel) {
            step1Panel.classList.add("active");
        }

        editorScreen.classList.remove("active");

        return;
    }


    // =========================================
    // STEP 02
    // =========================================

    if (state.currentStep === 2) {

        if (framePanel) {
            framePanel.classList.add("active");
        }

    }


    // =========================================
    // STEP 03
    // =========================================

    if (state.currentStep === 3) {

        if (backgroundPanel) {
            backgroundPanel.classList.add("active");
        }

    }


    // =========================================
    // STEP 04
    // =========================================

    if (state.currentStep === 4) {

        if (titlePanel) {
            titlePanel.classList.add("active");
        }

    }


    // =========================================
    // STEP 05
    // =========================================

    if (state.currentStep === 5) {

        if (finishPanel) {
            finishPanel.classList.add("active");
        }

        updateFinishPanel();

    }

    if (state.currentStep === 6) {

    if (exportPanel) {
        exportPanel.classList.add("active");
    }

    updateExportPreview();

}

    // =========================================
    // STEP 02以降
    // =========================================

    step1Panel.classList.remove("active");

    editorScreen.classList.add("active");
}


stepButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                goToStep(
                    button.dataset.step
                );

            }
        );

    }
);


toStep2.addEventListener(
    "click",
    () => {

        goToStep(2);

    }
);


/* ==================================================
   TEMPLATE / PARTS
================================================== */

modeButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const mode =
                    button.dataset.mode;


                modeButtons.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                templateContent.classList.toggle(
                    "active",
                    mode === "template"
                );


                partsContent.classList.toggle(
                    "active",
                    mode === "parts"
                );

            }
        );

    }
);


/* ==================================================
   MATERIAL PATH
================================================== */

function getMaterialPath(
    folder,
    file
) {

    return (
        `assets/frame/${folder}/` +
        encodeURIComponent(file)
    );

}


/* ==================================================
   MATERIAL CARD
================================================== */

function createMaterialCard(
    material,
    folder
) {

    const src =
        getMaterialPath(
            folder,
            material.file
        );


    return `
        <button
            type="button"
            class="frame-material"
            data-src="${src}"
            data-name="${material.name}"
            data-folder="${folder}"
            data-material-id="${material.id}"
        >

            <img
                src="${src}"
                alt="${material.name}"
            >

            <span>
                ${material.name}
            </span>

        </button>
    `;

}


/* ==================================================
   TEMPLATE
================================================== */

function renderTemplates() {

    const templates =
        frameMaterials.template || [];


    if (
        templates.length === 0
    ) {

        templateOptions.innerHTML = `
            <p class="empty-message">
                テンプレートはありません。
            </p>
        `;

        return;
    }


    templateOptions.innerHTML =
        templates
            .map(
                (material) =>
                    createMaterialCard(
                        material,
                        "template"
                    )
            )
            .join("");

}


/* ==================================================
   FRAME CATEGORY
================================================== */

function renderFrameCategory(
    category
) {

    const materials =
        frameMaterials[category] || [];


    if (
        materials.length === 0
    ) {

        frameOptions.innerHTML = `
            <p class="empty-message">
                このカテゴリーには
                まだ素材がありません。
            </p>
        `;

        return;
    }


    frameOptions.innerHTML =
        materials
            .map(
                (material) =>
                    createMaterialCard(
                        material,
                        category
                    )
            )
            .join("");

}


/* ==================================================
   CATEGORY CLICK
================================================== */

frameCategories.forEach(
    (category) => {

        category.addEventListener(
            "click",
            () => {

                frameCategories.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                category.classList.add(
                    "active"
                );


                const selectedCategory =
                    category.dataset.category;


                renderFrameCategory(
                    selectedCategory
                );

            }
        );

    }
);


/* ==================================================
   OBJECT ID
================================================== */

function createObjectId() {

    return (
        "obj_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


/* ==================================================
   SVG POINT
================================================== */

function getSVGPoint(event) {

    const point =
        coverCanvas.createSVGPoint();


    point.x =
        event.clientX;

    point.y =
        event.clientY;


    const matrix =
        coverCanvas
            .getScreenCTM();


    if (!matrix) {
        return {
            x: 0,
            y: 0
        };
    }


    return point
        .matrixTransform(
            matrix.inverse()
        );

}


/* ==================================================
   OBJECT ELEMENT
================================================== */

function getObjectElement(
    objectId
) {

    return coverCanvas.querySelector(
        `[data-object-id="${objectId}"]`
    );

}


/* ==================================================
   OBJECT DATA
================================================== */

function getObjectData(
    objectId
) {

    return state.objects.find(
        (object) =>
            object.id === objectId
    );

}

/* ==================================================
   BACKGROUND
================================================== */

function ensureBackgroundDefs() {

    let defs =
        coverCanvas.querySelector("defs");


    if (!defs) {

        defs =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "defs"
            );

        coverCanvas.insertBefore(
            defs,
            coverCanvas.firstChild
        );

    }


    return defs;

}


/* =========================
   背景を反映
========================= */
function applyBackground() {

    if (!background) {
        return;
    }

    const svg = coverCanvas;

    // 古い背景画像を削除
    const oldImage =
        svg.querySelector(
            "#background-image-element"
        );

    if (oldImage) {
        oldImage.remove();
    }

    const defs =
        ensureBackgroundDefs();

    // =========================
    // 単色
    // =========================

    if (
        state.background.type ===
        "color"
    ) {

        background.style.fill =
            state.background.color;

        background.setAttribute(
            "fill",
            state.background.color
        );

        background.style.pointerEvents =
            "auto";

        return;
    }


    // =========================
    // グラデーション
    // =========================

    if (
        state.background.type ===
        "gradient"
    ) {

        let gradient =
            defs.querySelector(
                "#background-gradient"
            );

        if (!gradient) {

            gradient =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "linearGradient"
                );

            gradient.setAttribute(
                "id",
                "background-gradient"
            );

            gradient.innerHTML = `
                <stop
                    id="background-stop-1"
                    offset="0%"
                />

                <stop
                    id="background-stop-2"
                    offset="100%"
                />
            `;

            defs.appendChild(
                gradient
            );
        }

        const angle =
            Number(
                state.background.gradientAngle
            ) *
            Math.PI /
            180;

        gradient.setAttribute(
            "x1",
            0.5 -
            Math.cos(angle) * 0.5
        );

        gradient.setAttribute(
            "y1",
            0.5 -
            Math.sin(angle) * 0.5
        );

        gradient.setAttribute(
            "x2",
            0.5 +
            Math.cos(angle) * 0.5
        );

        gradient.setAttribute(
            "y2",
            0.5 +
            Math.sin(angle) * 0.5
        );

        gradient
            .querySelector(
                "#background-stop-1"
            )
            .setAttribute(
                "stop-color",
                state.background.gradientColor1
            );

        gradient
            .querySelector(
                "#background-stop-2"
            )
            .setAttribute(
                "stop-color",
                state.background.gradientColor2
            );

        background.style.fill =
            "url(#background-gradient)";

        background.setAttribute(
            "fill",
            "url(#background-gradient)"
        );

        background.style.pointerEvents =
            "auto";

        return;
    }


    // =========================
    // 画像
    // =========================

    if (state.background.type === "image") {

        if (!state.background.image) {
            background.style.fill = "#FFFFFF";
            background.setAttribute("fill", "#FFFFFF");
            return;
        }

        const ratio =
            state.background.imageAspectRatio || 1;

        const scale =
            state.background.imageScale || 1;

        /*
         * 基準は「ノートの高さ」
         *
         * scale = 1
         * → 画像の高さ = ノートの高さ
         *
         * scale = 2
         * → 画像を2倍
         */
        const height =
            state.notebook.height * scale;

        const width =
            height * ratio;

        const x =
            state.background.imageX || 0;

        const y =
            state.background.imageY || 0;


        // -------------------------
        // クリップ領域
        // -------------------------

        let clipPath =
            defs.querySelector("#background-clip");

        if (!clipPath) {

            clipPath =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "clipPath"
                );

            clipPath.setAttribute(
                "id",
                "background-clip"
            );

            const clipRect =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                );

            clipRect.setAttribute(
                "id",
                "background-clip-rect"
            );

            clipPath.appendChild(
                clipRect
            );

            defs.appendChild(
                clipPath
            );
        }


        const clipRect =
            clipPath.querySelector(
                "#background-clip-rect"
            );

        clipRect.setAttribute(
            "x",
            "0"
        );

        clipRect.setAttribute(
            "y",
            "0"
        );

        clipRect.setAttribute(
            "width",
            state.notebook.width
        );

        clipRect.setAttribute(
            "height",
            state.notebook.height
        );


        // -------------------------
        // 画像
        // -------------------------

        const image =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "image"
            );

        image.setAttribute(
            "id",
            "background-image-element"
        );

        image.setAttribute(
            "x",
            x
        );

        image.setAttribute(
            "y",
            y
        );

        image.setAttribute(
            "width",
            width
        );

        image.setAttribute(
            "height",
            height
        );

        /*
         * 元画像の比率をそのまま使う
         * 画像自体はトリミングしない
         */
        image.setAttribute(
            "preserveAspectRatio",
            "none"
        );

        image.setAttribute(
            "href",
            state.background.image
        );

        image.setAttribute(
            "xlink:href",
            state.background.image
        );

        image.setAttribute(
            "clip-path",
            "url(#background-clip)"
        );

        image.style.pointerEvents =
            "auto";

        image.style.filter = `
            brightness(${state.background.imageBrightness || 100}%)
            contrast(${state.background.imageContrast || 100}%)
            saturate(${state.background.imageSaturation || 100}%)
            sepia(${state.background.imageSepia || 0}%)
            hue-rotate(${state.background.imageHue || 0}deg)
        `;


        svg.insertBefore(
            image,
            background
        );


        // 背景rectは透明
        background.style.fill =
            "transparent";

        background.setAttribute(
            "fill",
            "transparent"
        );

        background.style.pointerEvents =
            "none";
    }
}



/* ==================================================
   BACKGROUND IMAGE MOVE
================================================== */

let draggingBackground = false;

let backgroundStartMouseX = 0;
let backgroundStartMouseY = 0;

let backgroundStartX = 0;
let backgroundStartY = 0;


coverCanvas.addEventListener(
    "mousedown",
    (event) => {

        if (
            event.button !== 0 ||
            state.background.type !== "image" ||
            !state.background.image
        ) {
            return;
        }

        /*
         * 通常ドラッグでオブジェクトを触った場合
         * → オブジェクト操作
         *
         * Alt＋ドラッグ
         * → 背景操作
         */
        if (
            event.target.closest(".canvas-object") &&
            !event.altKey
        ) {
            return;
        }

        const point =
            getSVGPoint(event);

        draggingBackground = true;

        backgroundStartMouseX =
            point.x;

        backgroundStartMouseY =
            point.y;

        backgroundStartX =
            state.background.imageX || 0;

        backgroundStartY =
            state.background.imageY || 0;

        event.preventDefault();
    }
);


window.addEventListener(
    "mousemove",
    (event) => {

        if (!draggingBackground) {
            return;
        }

        const point =
            getSVGPoint(event);

        const dx =
            point.x -
            backgroundStartMouseX;

        const dy =
            point.y -
            backgroundStartMouseY;

        /*
         * 制限なし
         *
         * ノートの外まで自由に動かせる。
         * 見える範囲はclipPathが制限する。
         */
        state.background.imageX =
            backgroundStartX + dx;

        state.background.imageY =
            backgroundStartY + dy;


        const image =
            document.getElementById(
                "background-image-element"
            );

        if (image) {

            image.setAttribute(
                "x",
                state.background.imageX
            );

            image.setAttribute(
                "y",
                state.background.imageY
            );
        }
    }
);


window.addEventListener(
    "mouseup",
    () => {

        if (!draggingBackground) {
            return;
        }

        draggingBackground = false;

        saveHistory();
    }
);


/* =========================
   背景タイプ変更
========================= */

function setBackgroundType(
    type,
    recordHistory = true
) {

    state.background.type =
        type;


    backgroundTypeButtons.forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset.backgroundType ===
                type
            );

        }
    );


    document
        .querySelectorAll(
            ".background-content"
        )
        .forEach(
            (content) => {

                content.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            `background-${type}-content`
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    applyBackground();


    if (recordHistory) {

        saveHistory();

    }

}


/* =========================
   タイプボタン
========================= */

backgroundTypeButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                setBackgroundType(
                    button.dataset.backgroundType
                );

            }
        );

    }
);


/* =========================
   単色
========================= */

if (backgroundColorInput) {

    backgroundColorInput.addEventListener(
        "input",
        () => {

            state.background.color =
                backgroundColorInput.value;


            if (
                state.background.type ===
                "color"
            ) {

                applyBackground();

            }

        }
    );


    backgroundColorInput.addEventListener(
        "change",
        saveHistory
    );

}


/* =========================
   グラデーションカラー1
========================= */

if (gradientColor1Input) {

    gradientColor1Input.addEventListener(
        "input",
        () => {

            state.background.gradientColor1 =
                gradientColor1Input.value;


            if (
                state.background.type ===
                "gradient"
            ) {

                applyBackground();

            }

        }
    );


    gradientColor1Input.addEventListener(
        "change",
        saveHistory
    );

}


/* =========================
   グラデーションカラー2
========================= */

if (gradientColor2Input) {

    gradientColor2Input.addEventListener(
        "input",
        () => {

            state.background.gradientColor2 =
                gradientColor2Input.value;


            if (
                state.background.type ===
                "gradient"
            ) {

                applyBackground();

            }

        }
    );


    gradientColor2Input.addEventListener(
        "change",
        saveHistory
    );

}


/* =========================
   グラデーション角度
========================= */

if (gradientAngleInput) {

    gradientAngleInput.addEventListener(
        "input",
        () => {

            state.background.gradientAngle =
                Number(
                    gradientAngleInput.value
                );


            if (gradientAngleValue) {

                gradientAngleValue.textContent =
                    `${state.background.gradientAngle}°`;

            }


            if (
                state.background.type ===
                "gradient"
            ) {

                applyBackground();

            }

        }
    );


    gradientAngleInput.addEventListener(
        "change",
        saveHistory
    );

}


/* =========================
   背景画像
========================= */
if (backgroundImageInput) {
    backgroundImageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

reader.onload = (e) => {

    const imageData =
        e.target.result;

    const img = new Image();

        img.onload = () => {

            state.background.image =
                imageData;

            state.background.imageAspectRatio =
                img.naturalWidth /
                img.naturalHeight;

            // 初期状態
           state.background.imageScale = 1;

            // 高さをノートに合わせたときの画像幅
            const initialHeight = state.notebook.height;
            const initialWidth =
                initialHeight *
                state.background.imageAspectRatio;

            // 横方向の中央
            state.background.imageX =
                (state.notebook.width - initialWidth) / 2;

            // 上端を合わせる
            state.background.imageY = 0;


            state.background.type =
                "image";

            applyBackground();

            syncBackgroundControls();

            saveHistory();
        };

        img.src = imageData;
    };


        reader.readAsDataURL(file);
    });
}
/* =========================
   UI同期
========================= */

function syncBackgroundControls() {

    if (backgroundColorInput) {

        backgroundColorInput.value =
            state.background.color;

    }


    if (gradientColor1Input) {

        gradientColor1Input.value =
            state.background.gradientColor1;

    }


    if (gradientColor2Input) {

        gradientColor2Input.value =
            state.background.gradientColor2;

    }


    if (gradientAngleInput) {

        gradientAngleInput.value =
            state.background.gradientAngle;

    }


    if (gradientAngleValue) {

        gradientAngleValue.textContent =
            `${state.background.gradientAngle}°`;

    }


    // 背景画像の調整値

    const scaleInput =
        document.getElementById(
            "background-scale"
        );

    const scaleValue =
        document.getElementById(
            "background-scale-value"
        );

    if (scaleInput) {

        const scale =
            state.background.imageScale || 1;

        scaleInput.value =
            Math.round(scale * 100);

        if (scaleValue) {

            scaleValue.textContent =
                `${Math.round(scale * 100)}%`;

        }

    }


    const brightnessInput =
        document.getElementById(
            "background-brightness"
        );

    const brightnessValue =
        document.getElementById(
            "background-brightness-value"
        );

    if (brightnessInput) {

        brightnessInput.value =
            state.background.imageBrightness ?? 100;

        if (brightnessValue) {

            brightnessValue.textContent =
                `${brightnessInput.value}%`;

        }

    }


    const contrastInput =
        document.getElementById(
            "background-contrast"
        );

    const contrastValue =
        document.getElementById(
            "background-contrast-value"
        );

    if (contrastInput) {

        contrastInput.value =
            state.background.imageContrast ?? 100;

        if (contrastValue) {

            contrastValue.textContent =
                `${contrastInput.value}%`;

        }

    }


    const saturationInput =
        document.getElementById(
            "background-saturation"
        );

    const saturationValue =
        document.getElementById(
            "background-saturation-value"
        );

    if (saturationInput) {

        saturationInput.value =
            state.background.imageSaturation ?? 100;

        if (saturationValue) {

            saturationValue.textContent =
                `${saturationInput.value}%`;

        }

    }


    const sepiaInput =
        document.getElementById(
            "background-sepia"
        );

    const sepiaValue =
        document.getElementById(
            "background-sepia-value"
        );

    if (sepiaInput) {

        sepiaInput.value =
            state.background.imageSepia ?? 0;

        if (sepiaValue) {

            sepiaValue.textContent =
                `${sepiaInput.value}%`;

        }

    }


    const hueInput =
        document.getElementById(
            "background-hue"
        );

    const hueValue =
        document.getElementById(
            "background-hue-value"
        );

    if (hueInput) {

        hueInput.value =
            state.background.imageHue ?? 0;

        if (hueValue) {

            hueValue.textContent =
                `${hueInput.value}°`;

        }

    }


    setBackgroundType(
        state.background.type,
        false
    );

}

// 背景画像調整スライダー
const backgroundControls = [
    ["background-scale", "background-scale-value", "imageScale", true, "%"],
    ["background-position-x", "background-position-x-value", "imageX", false, ""],
    ["background-position-y", "background-position-y-value", "imageY", false, ""],
    ["background-brightness", "background-brightness-value", "imageBrightness", false, "%"],
    ["background-contrast", "background-contrast-value", "imageContrast", false, "%"],
    ["background-saturation", "background-saturation-value", "imageSaturation", false, "%"],
    ["background-sepia", "background-sepia-value", "imageSepia", false, "%"],
    ["background-hue", "background-hue-value", "imageHue", false, "°"]
];

backgroundControls.forEach(
    ([inputId, valueId, stateKey, isScale, unit]) => {

        const input = document.getElementById(inputId);
        const value = document.getElementById(valueId);

        if (!input) return;

        input.addEventListener("input", () => {

            const number = Number(input.value);

            state.background[stateKey] =
                isScale ? number / 100 : number;

            if (value) {
                value.textContent =
                    `${input.value}${unit}`;
            }

            applyBackground();
        });

        input.addEventListener("change", () => {
            saveHistory();
        });
    }
);

const scaleInput =
    document.getElementById(
        "background-scale"
    );

const scaleValue =
    document.getElementById(
        "background-scale-value"
    );

if (scaleInput) {
    const scale =
        state.background.imageScale || 1;

    scaleInput.value =
        Math.round(scale * 100);

    if (scaleValue) {
        scaleValue.textContent =
            `${Math.round(scale * 100)}%`;
    }
}

/* ==================================================
   ADD IMAGE OBJECT
================================================== */

function addImageObject(
    material,
    src
) {

    const objectId =
        createObjectId();


    const width =
        state.notebook.width;

    const height =
        state.notebook.height;


    const objectData = {

        id: objectId,

        type: "image",

        name:
            material.dataset.name ||
            "素材",

        src: src,

        x: 0,

        y: 0,

        width: width,

        height: height,

        rotation: 0,

        // フレームの色調
        brightness: 100,
        contrast: 100,
        saturation: 100,
        sepia: 0,
        hue: 0,

        visible: true,
        locked: false
    };


    state.objects.push(
        objectData
    );


    const image =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );


    image.classList.add(
        "canvas-object"
    );


    image.dataset.objectId =
        objectId;

    image.dataset.name =
        objectData.name;


    image.setAttribute(
        "href",
        src
    );


    image.setAttribute(
        "x",
        objectData.x
    );

    image.setAttribute(
        "y",
        objectData.y
    );

    image.setAttribute(
        "width",
        objectData.width
    );

    image.setAttribute(
        "height",
        objectData.height
    );


    image.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    coverCanvas.appendChild(
        image
    );


    selectObject(
        objectId
    );


    updateLayerList();

    saveHistory();


    console.log(
        "Object added:",
        objectData
    );

}


/* ==================================================
   MATERIAL CLICK
================================================== */

function handleMaterialClick(
    event
) {

    const material =
        event.target.closest(
            ".frame-material"
        );


    if (!material) {
        return;
    }


    const src =
        material.dataset.src;


    addImageObject(
        material,
        src
    );

}


frameOptions.addEventListener(
    "click",
    handleMaterialClick
);


templateOptions.addEventListener(
    "click",
    handleMaterialClick
);


/* ==================================================
   SELECTION
================================================== */

let selectedHandleElements = [];


function clearSelectionVisual() {

    document
        .querySelectorAll(
            ".canvas-object"
        )
        .forEach(
            (object) => {

                object.classList.remove(
                    "selected-object"
                );

            }
        );


    selectedHandleElements.forEach(
        (handle) => {

            handle.remove();

        }
    );


    selectedHandleElements = [];

}


/* ==================================================
   SELECT OBJECT
================================================== */
function selectObject(objectId) {

    const object = getObjectData(objectId);

    if (!object) {
        return;
    }

    clearSelectionVisual();

    state.selectedObjectId = objectId;

    const element = getObjectElement(objectId);

    if (!element) {
        return;
    }

    element.classList.add("selected-object");

    createResizeHandles(element);

    updateLayerList();
    updatePropertiesPanel();

    if (floatingToolbar) {
        floatingToolbar.classList.add("active");
    }

    syncFrameControls();

    /* ==================================================
   FRAME FILTER
================================================== */

function applyFrameFilter(object) {
    if (!object || object.type !== "image") return;

    const element = getObjectElement(object.id);
    if (!element) return;

    element.style.filter = `
        brightness(${object.brightness ?? 100}%)
        contrast(${object.contrast ?? 100}%)
        saturate(${object.saturation ?? 100}%)
        sepia(${object.sepia ?? 0}%)
        hue-rotate(${object.hue ?? 0}deg)
    `;
}


/* ==================================================
   FRAME ADJUSTMENT CONTROLS
================================================== */

const frameControls = [
    ["frame-brightness", "frame-brightness-value", "brightness", "%"],
    ["frame-contrast", "frame-contrast-value", "contrast", "%"],
    ["frame-saturation", "frame-saturation-value", "saturation", "%"],
    ["frame-sepia", "frame-sepia-value", "sepia", "%"],
    ["frame-hue", "frame-hue-value", "hue", "°"]
];

frameControls.forEach(([inputId, valueId, stateKey, unit]) => {
    const input = document.getElementById(inputId);
    const value = document.getElementById(valueId);

    if (!input) return;

    input.addEventListener("input", () => {
        const object = getObjectData(state.selectedObjectId);

        if (!object || object.type !== "image") return;

        object[stateKey] = Number(input.value);

        if (value) {
            value.textContent = `${input.value}${unit}`;
        }

        applyFrameFilter(object);
    });

    input.addEventListener("change", () => {
        saveHistory();
    });
});

}

/* ==================================================
   DESELECT
================================================== */

function deselectObject() {

    clearSelectionVisual();


    state.selectedObjectId =
        null;


    updateLayerList();


    updatePropertiesPanel();


    if (floatingToolbar) {

        floatingToolbar.classList.remove(
            "active"
        );

    }

}


/* ==================================================
   CANVAS CLICK
================================================== */

coverCanvas.addEventListener(
    "click",
    (event) => {

        /*
         * ハンドルをクリックした場合は
         * 選択解除しない。
         */

        if (
            event.target.closest(
                ".resize-handle, .rotate-handle"
            )
        ) {
            return;
        }


        const object =
            event.target.closest(
                ".canvas-object"
            );


        if (!object) {

            if (
                event.target.closest(
                    "#background-image-element"
                )
            ) {
                return;
            }

            deselectObject();

            return;
        }


        selectObject(
            object.dataset.objectId
        );

    }
);


/* ==================================================
   DRAG STATE
================================================== */

let draggingObject = null;

let dragStartMouseX = 0;
let dragStartMouseY = 0;

let dragStartObjectX = 0;
let dragStartObjectY = 0;


/* ==================================================
   OBJECT DRAG START
================================================== */

coverCanvas.addEventListener(
    "mousedown",
    (event) => {

        /*
         * 左クリックだけ。
         */

        if (
            event.button !== 0
        ) {
            return;
        }

        // Alt＋ドラッグは背景操作にする
        if (event.altKey) {
            return;
        }

        /*
         * リサイズハンドルの場合は
         * 通常のドラッグを開始しない。
         */

if (
    event.target.closest(
        ".resize-handle, .rotate-handle"
    )
) {
    return;
}


        const object =
            event.target.closest(
                ".canvas-object"
            );


        if (!object) {
            return;
        }


        const objectId =
            object.dataset.objectId;


        const objectData =
            getObjectData(
                objectId
            );


        if (!objectData) {
            return;
        }


        if (objectData.locked) {
            return;
        }


        selectObject(
            objectId
        );


        const point =
            getSVGPoint(event);


        draggingObject =
            object;


        dragStartMouseX =
            point.x;

        dragStartMouseY =
            point.y;


        dragStartObjectX =
            objectData.x;

        dragStartObjectY =
            objectData.y;


        event.preventDefault();

    }
);


/* ==================================================
   OBJECT DRAG MOVE
================================================== */
/* ==================================================
   ROTATE MOVE
================================================== */

window.addEventListener(
    "mousemove",
    (event) => {

        if (!rotatingObject) {
            return;
        }

        const objectData =
            rotatingObject;

        const point =
            getSVGPoint(event);

        const centerX =
            objectData.type === "text"
                ? objectData.x
                : objectData.x +
                  objectData.width / 2;

        const centerY =
            objectData.type === "text"
                ? objectData.y
                : objectData.y +
                  objectData.height / 2;

        let currentAngle =
            Math.atan2(
                point.y - centerY,
                point.x - centerX
            ) *
            180 /
            Math.PI;

        let rotation =
            rotationStartObjectRotation +
            (
                currentAngle -
                rotationStartAngle
            );

        if (event.shiftKey) {
            rotation =
                Math.round(
                    rotation / 15
                ) * 15;
        }

        rotation =
            ((rotation % 360) + 360) % 360;

        objectData.rotation =
            rotation;

        const element =
            getObjectElement(
                objectData.id
            );

        if (element) {

            element.setAttribute(
                "transform",
                `rotate(${rotation} ${centerX} ${centerY})`
            );
        }

        rotationChanged = true;

        updateResizeHandles(
            element
        );

        updatePropertiesPanel();
    }
);


window.addEventListener(
    "mousemove",
    (event) => {

        if (!draggingObject) {
            return;
        }


        const objectId =
            draggingObject.dataset.objectId;


        const objectData =
            getObjectData(
                objectId
            );


        if (!objectData) {
            return;
        }


        const point =
            getSVGPoint(event);


        const deltaX =
            point.x -
            dragStartMouseX;


        const deltaY =
            point.y -
            dragStartMouseY;


        objectData.x =
            dragStartObjectX +
            deltaX;

        objectData.y =
            dragStartObjectY +
            deltaY;


        draggingObject.setAttribute(
            "x",
            objectData.x
        );

        draggingObject.setAttribute(
            "y",
            objectData.y
        );


        updateResizeHandles(
            draggingObject
        );


        updatePropertiesPanel();

    }
);


/* ==================================================
   OBJECT DRAG END
================================================== */

window.addEventListener(
    "mouseup",
    () => {

        // ドラッグ終了
        draggingObject = null;

        // 回転終了
        if (rotatingObject) {

            if (rotationChanged) {
                saveHistory();
            }

            rotatingObject = null;
            rotationChanged = false;
        }

        // リサイズ終了
        if (resizingObject) {

            if (resizeChanged) {
                saveHistory();
            }

            resizingObject = null;
            resizeHandleType = null;
            resizeChanged = false;

        } else {

            resizeHandleType = null;
        }
    }
);

/* ==================================================
   RESIZE STATE
================================================== */

let resizingObject = null;

let resizeHandleType = null;

let resizeStartMouseX = 0;
let resizeStartMouseY = 0;

let resizeStartX = 0;
let resizeStartY = 0;

let resizeStartWidth = 0;
let resizeStartHeight = 0;

let resizeStartRatio = 1;

let resizeStartFontSize = 12;

let resizeChanged = false;

let rotatingObject = null;
let rotationStartAngle = 0;
let rotationStartObjectRotation = 0;
let rotationChanged = false;

/* ==================================================
   CREATE RESIZE HANDLES
================================================== */

function createResizeHandles(objectElement) {

    const objectId =
        objectElement.dataset.objectId;

    const objectData =
        getObjectData(objectId);

    if (!objectData) {
        return;
    }

    const handleSize =
        Math.max(
            Math.min(
                Math.min(
                    objectData.width,
                    objectData.height
                ) * 0.035,
                4
            ),
            2
        );

    const handleTypes = [
        "nw",
        "ne",
        "sw",
        "se"
    ];

    handleTypes.forEach((type) => {

        const handle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            );

        handle.classList.add(
            "resize-handle"
        );

        handle.dataset.handle = type;
        handle.dataset.objectId = objectId;

        handle.setAttribute(
            "width",
            handleSize
        );

        handle.setAttribute(
            "height",
            handleSize
        );

        handle.addEventListener(
            "mousedown",
            startResize
        );

        coverCanvas.appendChild(handle);

        selectedHandleElements.push(
            handle
        );
    });


    // 回転ハンドル
    const rotateHandle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    rotateHandle.classList.add(
        "rotate-handle"
    );

    rotateHandle.dataset.objectId =
        objectId;

    rotateHandle.setAttribute(
        "r",
        "3"
    );

    rotateHandle.addEventListener(
        "mousedown",
        startRotate
    );

    coverCanvas.appendChild(
        rotateHandle
    );

    selectedHandleElements.push(
        rotateHandle
    );

    updateResizeHandles(
        objectElement
    );
}


/* ==================================================
   UPDATE RESIZE HANDLES
================================================== */

function updateResizeHandles(
    objectElement
) {

    if (!objectElement) {
        return;
    }

    const objectId =
        objectElement.dataset.objectId;

    const objectData =
        getObjectData(objectId);

    if (!objectData) {
        return;
    }

    const handles =
        selectedHandleElements.filter(
            (handle) =>
                handle.dataset.objectId ===
                objectId
        );

    const resizeHandles =
        handles.filter(
            (handle) =>
                handle.classList.contains(
                    "resize-handle"
                )
        );

    const rotateHandle =
        handles.find(
            (handle) =>
                handle.classList.contains(
                    "rotate-handle"
                )
        );

    const handleSize =
        Number(
            resizeHandles[0]?.getAttribute(
                "width"
            )
        ) || 3;

    const half =
        handleSize / 2;

    const left =
        objectData.x;

    const right =
        objectData.x +
        objectData.width;

    const top =
        objectData.y;

    const bottom =
        objectData.y +
        objectData.height;

    resizeHandles.forEach(
        (handle) => {

            const type =
                handle.dataset.handle;

            let x = 0;
            let y = 0;

            if (type === "nw") {
                x = left - half;
                y = top - half;
            }

            if (type === "ne") {
                x = right - half;
                y = top - half;
            }

            if (type === "sw") {
                x = left - half;
                y = bottom - half;
            }

            if (type === "se") {
                x = right - half;
                y = bottom - half;
            }

            handle.setAttribute(
                "x",
                x
            );

            handle.setAttribute(
                "y",
                y
            );
        }
    );

    // 回転ハンドル
    if (rotateHandle) {

        const centerX =
            objectData.type === "text"
                ? objectData.x
                : objectData.x +
                  objectData.width / 2;

        const rotateY =
            objectData.y - 8;

        rotateHandle.setAttribute(
            "cx",
            centerX
        );

        rotateHandle.setAttribute(
            "cy",
            rotateY
        );
    }
}


/* ==================================================
   RESIZE START
================================================== */
function startRotate(event) {

    const objectId =
        event.currentTarget.dataset.objectId;

    const objectData =
        getObjectData(objectId);

    if (!objectData || objectData.locked) {
        return;
    }

    selectObject(objectId);

    event.preventDefault();

    const point =
        getSVGPoint(event);

    const centerX =
        objectData.type === "text"
            ? objectData.x
            : objectData.x +
              objectData.width / 2;

    const centerY =
        objectData.type === "text"
            ? objectData.y
            : objectData.y +
              objectData.height / 2;

    rotationStartAngle =
        Math.atan2(
            point.y - centerY,
            point.x - centerX
        ) *
        180 /
        Math.PI;

    rotationStartObjectRotation =
        objectData.rotation || 0;

    rotatingObject = objectData;
    rotationChanged = false;

    event.preventDefault();
    event.stopPropagation();
}

function startResize(
    event
) {

    if (
        event.button !== 0
    ) {
        return;
    }


    const handle =
        event.currentTarget;


    const objectId =
        handle.dataset.objectId;


    const objectElement =
        getObjectElement(
            objectId
        );


    const objectData =
        getObjectData(
            objectId
        );


    if (
        !objectElement ||
        !objectData
    ) {
        return;
    }


    if (objectData.locked) {
        return;
    }


    selectObject(
        objectId
    );


    const point =
        getSVGPoint(event);


    resizingObject =
        objectElement;


    resizeHandleType =
        handle.dataset.handle;


    resizeStartMouseX =
        point.x;

    resizeStartMouseY =
        point.y;


    resizeStartX =
        objectData.x;

    resizeStartY =
        objectData.y;


    resizeStartWidth =
        objectData.width;

    resizeStartHeight =
        objectData.height;


    resizeStartRatio =
        resizeStartWidth /
        resizeStartHeight;

    resizeStartFontSize =
    objectData.fontSize || 12;


    event.preventDefault();

    event.stopPropagation();

}


/* ==================================================
   RESIZE MOVE
================================================== */

window.addEventListener(
    "mousemove",
    (event) => {

        if (!resizingObject) {
            return;
        }

        const objectId =
            resizingObject.dataset.objectId;

        const objectData =
            getObjectData(objectId);

        if (!objectData) {
            return;
        }

        const point =
            getSVGPoint(event);

        const deltaX =
            point.x -
            resizeStartMouseX;

        const deltaY =
            point.y -
            resizeStartMouseY;

        const keepRatio =
            !event.shiftKey;

        /*
         * =========================================
         * タイトル
         * =========================================
         */

if (objectData.type === "text") {

    let scale;

    if (
        resizeHandleType === "se" ||
        resizeHandleType === "ne"
    ) {
        scale =
            (
                resizeStartWidth +
                deltaX
            ) /
            resizeStartWidth;
    } else {
        scale =
            (
                resizeStartWidth -
                deltaX
            ) /
            resizeStartWidth;
    }

    /*
     * 最小サイズ
     */
    scale = Math.max(scale, 0.2);

    /*
     * ★必ず「開始時の文字サイズ」を基準にする
     */
    const startFontSize =
        resizeStartFontSize ||
        objectData.fontSize ||
        12;

    objectData.fontSize =
        startFontSize * scale;

    /*
     * 文字サイズ更新
     */
    resizingObject.setAttribute(
        "font-size",
        objectData.fontSize
    );

    /*
     * 選択枠のサイズ
     */
    objectData.width =
        resizeStartWidth * scale;

    objectData.height =
        resizeStartHeight * scale;

    /*
     * 左側から縮めた場合
     */
    if (
        resizeHandleType === "sw" ||
        resizeHandleType === "nw"
    ) {
        objectData.x =
            resizeStartX +
            resizeStartWidth -
            objectData.width;
    } else {
        objectData.x =
            resizeStartX;
    }

    /*
     * 上側から縮めた場合
     */
    if (
        resizeHandleType === "nw" ||
        resizeHandleType === "ne"
    ) {
        objectData.y =
            resizeStartY +
            resizeStartHeight -
            objectData.height;
    } else {
        objectData.y =
            resizeStartY;
    }

    resizingObject.setAttribute(
        "x",
        objectData.x
    );

    resizingObject.setAttribute(
        "y",
        objectData.y
    );

    updateResizeHandles(
        resizingObject
    );

    updatePropertiesPanel();

    resizeChanged = true;

    return;
}

        /*
         * =========================================
         * 画像など通常オブジェクト
         * =========================================
         */

        let x =
            resizeStartX;

        let y =
            resizeStartY;

        let width =
            resizeStartWidth;

        let height =
            resizeStartHeight;

        /*
         * 自由変形
         */

        if (!keepRatio) {

            if (
                resizeHandleType === "se"
            ) {
                width =
                    resizeStartWidth +
                    deltaX;

                height =
                    resizeStartHeight +
                    deltaY;
            }

            if (
                resizeHandleType === "sw"
            ) {
                width =
                    resizeStartWidth -
                    deltaX;

                height =
                    resizeStartHeight +
                    deltaY;

                x =
                    resizeStartX +
                    deltaX;
            }

            if (
                resizeHandleType === "ne"
            ) {
                width =
                    resizeStartWidth +
                    deltaX;

                height =
                    resizeStartHeight -
                    deltaY;

                y =
                    resizeStartY +
                    deltaY;
            }

            if (
                resizeHandleType === "nw"
            ) {
                width =
                    resizeStartWidth -
                    deltaX;

                height =
                    resizeStartHeight -
                    deltaY;

                x =
                    resizeStartX +
                    deltaX;

                y =
                    resizeStartY +
                    deltaY;
            }

        }

        /*
         * 縦横比固定
         */

        else {

            if (
                resizeHandleType === "se"
            ) {
                width =
                    resizeStartWidth +
                    deltaX;

                height =
                    width /
                    resizeStartRatio;
            }

            if (
                resizeHandleType === "sw"
            ) {
                width =
                    resizeStartWidth -
                    deltaX;

                height =
                    width /
                    resizeStartRatio;

                x =
                    resizeStartX +
                    (
                        resizeStartWidth -
                        width
                    );
            }

            if (
                resizeHandleType === "ne"
            ) {
                width =
                    resizeStartWidth +
                    deltaX;

                height =
                    width /
                    resizeStartRatio;

                y =
                    resizeStartY +
                    (
                        resizeStartHeight -
                        height
                    );
            }

            if (
                resizeHandleType === "nw"
            ) {
                width =
                    resizeStartWidth -
                    deltaX;

                height =
                    width /
                    resizeStartRatio;

                x =
                    resizeStartX +
                    (
                        resizeStartWidth -
                        width
                    );

                y =
                    resizeStartY +
                    (
                        resizeStartHeight -
                        height
                    );
            }

        }

        /*
         * 最小サイズ
         */

        const minSize = 10;

        if (width < minSize) {
            width = minSize;
        }

        if (height < minSize) {
            height = minSize;
        }

        /*
         * データ更新
         */

        objectData.x =
            x;

        objectData.y =
            y;

        objectData.width =
            width;

        objectData.height =
            height;

        resizeChanged = true;

        /*
         * SVG更新
         */

        resizingObject.setAttribute(
            "x",
            x
        );

        resizingObject.setAttribute(
            "y",
            y
        );

        resizingObject.setAttribute(
            "width",
            width
        );

        resizingObject.setAttribute(
            "height",
            height
        );

        updateResizeHandles(
            resizingObject
        );

        updatePropertiesPanel();
    }
);


/* ==================================================
   RESIZE END
================================================== */

window.addEventListener(
    "mouseup",
    () => {

        resizingObject =
            null;

        resizeHandleType =
            null;

    }
);


/* ==================================================
   LAYERS
================================================== */

function updateLayerList() {

    if (
        state.objects.length === 0
    ) {

        layerList.innerHTML = `
            <p class="empty-layer-message">
                レイヤーはありません
            </p>
        `;

        return;
    }


    const objects =
        [...state.objects].reverse();


    layerList.innerHTML =
        objects
            .map(
                (object) => {

                    const selected =
                        object.id ===
                        state.selectedObjectId;


                    return `
                        <button
                            type="button"
                            class="layer-item ${
                                selected
                                    ? "selected-layer"
                                    : ""
                            }"
                            data-object-id="${
                                object.id
                            }"
                        >

                            <span
                                class="layer-visibility"
                            >
                                ${
                                    object.visible
                                        ? "👁"
                                        : "○"
                                }
                            </span>

                            <span
                                class="layer-name"
                            >
                                ${
                                    object.name
                                }
                            </span>

                        </button>
                    `;

                }
            )
            .join("");

}



/* ==================================================
   PROPERTIES PANEL
================================================== */

function updatePropertiesPanel() {

    if (!objectProperties) {
        return;
    }

    const object =
        getObjectData(
            state.selectedObjectId
        );

    if (!object) {

        objectProperties.innerHTML = `
            <p class="empty-properties">
                オブジェクトを選択すると
                <br>
                設定が表示されます。
            </p>
        `;

        return;
    }

    const value = (number) =>
        Math.round(number * 100) / 100;

    objectProperties.innerHTML = `
        <div class="properties-content">

            <div class="property-title">
                ${object.name}
            </div>

            <hr>

            <label class="property-row">
                <span>X</span>
                <input
                    type="number"
                    id="property-x"
                    value="${value(object.x)}"
                    step="0.1"
                >
            </label>

            <label class="property-row">
                <span>Y</span>
                <input
                    type="number"
                    id="property-y"
                    value="${value(object.y)}"
                    step="0.1"
                >
            </label>

            <label class="property-row">
                <span>幅</span>
                <input
                    type="number"
                    id="property-width"
                    value="${value(object.width)}"
                    step="0.1"
                    min="1"
                >
            </label>

            <label class="property-row">
                <span>高さ</span>
                <input
                    type="number"
                    id="property-height"
                    value="${value(object.height)}"
                    step="0.1"
                    min="1"
                >
            </label>

            <label class="property-row">
                <span>回転</span>
                <input
                    type="number"
                    id="property-rotation"
                    value="${value(object.rotation || 0)}"
                    step="1"
                >
                <span>°</span>
            </label>

        </div>
    `;


    const xInput =
        document.getElementById(
            "property-x"
        );

    const yInput =
        document.getElementById(
            "property-y"
        );

    const widthInput =
        document.getElementById(
            "property-width"
        );

    const heightInput =
        document.getElementById(
            "property-height"
        );

    const rotationInput =
        document.getElementById(
            "property-rotation"
        );


    function applyProperties() {

        const currentObject =
            getObjectData(
                state.selectedObjectId
            );

        if (!currentObject) {
            return;
        }


        currentObject.x =
            Number(xInput.value);

        currentObject.y =
            Number(yInput.value);

        currentObject.width =
            Math.max(
                1,
                Number(widthInput.value)
            );

        currentObject.height =
            Math.max(
                1,
                Number(heightInput.value)
            );

        currentObject.rotation =
            Number(rotationInput.value);


        const element =
            getObjectElement(
                currentObject.id
            );

        if (!element) {
            return;
        }


        element.setAttribute(
            "x",
            currentObject.x
        );

        element.setAttribute(
            "y",
            currentObject.y
        );

        element.setAttribute(
            "width",
            currentObject.width
        );

        element.setAttribute(
            "height",
            currentObject.height
        );


        const centerX =
            currentObject.type === "text"
                ? currentObject.x
                : currentObject.x +
                  currentObject.width / 2;

        const centerY =
            currentObject.type === "text"
                ? currentObject.y
                : currentObject.y +
                  currentObject.height / 2;


        element.setAttribute(
            "transform",
            `rotate(
                ${currentObject.rotation}
                ${centerX}
                ${centerY}
            )`
        );


        updateResizeHandles(
            element
        );

        updateLayerList();

    }


    [
        xInput,
        yInput,
        widthInput,
        heightInput,
        rotationInput
    ].forEach((input) => {

        if (!input) {
            return;
        }

        input.addEventListener(
            "change",
            () => {

                applyProperties();
                saveHistory();

            }
        );

    });

}


/* ==================================================
   LAYER OPERATIONS
================================================== */


/* =========================
   前面へ
========================= */

function bringSelectedToFront() {

    const objectId =
        state.selectedObjectId;

    if (!objectId) {
        return;
    }


    const objectData =
        getObjectData(objectId);

    const objectElement =
        getObjectElement(objectId);


    if (
        !objectData ||
        !objectElement
    ) {
        return;
    }


    /*
     * データ上でも最後へ
     */

    const index =
        state.objects.findIndex(
            (object) =>
                object.id === objectId
        );


    if (index !== -1) {

        state.objects.splice(
            index,
            1
        );

        state.objects.push(
            objectData
        );

    }


    /*
     * SVG上でも一番前へ
     */

    clearSelectionVisual();

    coverCanvas.appendChild(
        objectElement
    );


    selectObject(
        objectId
    );


    updateLayerList();

    saveHistory();

}


/* =========================
   背面へ
========================= */

function sendSelectedToBack() {

    const objectId =
        state.selectedObjectId;

    if (!objectId) {
        return;
    }


    const objectData =
        getObjectData(objectId);

    const objectElement =
        getObjectElement(objectId);


    if (
        !objectData ||
        !objectElement
    ) {
        return;
    }


    /*
     * データ上で一番下へ
     */

    const index =
        state.objects.findIndex(
            (object) =>
                object.id === objectId
        );


    if (index !== -1) {

        state.objects.splice(
            index,
            1
        );

        state.objects.unshift(
            objectData
        );

    }


    /*
     * 背景の直後へ移動
     */

    clearSelectionVisual();

    coverCanvas.insertBefore(
        objectElement,
        background.nextSibling
    );


    selectObject(
        objectId
    );


    updateLayerList();

    saveHistory();

}


/* =========================
   複製
========================= */

function duplicateSelectedObject() {

    const objectId = state.selectedObjectId;

    if (!objectId) {
        return;
    }

    const original = getObjectData(objectId);

    if (!original) {
        return;
    }

    const newObject = {
        ...original,
        id: createObjectId(),
        x: original.x + 8,
        y: original.y + 8
    };

    const originalIndex =
        state.objects.findIndex(
            (object) => object.id === objectId
        );

    state.objects.splice(
        originalIndex + 1,
        0,
        newObject
    );

    /*
     * オブジェクトの種類に応じて
     * SVG要素を作る
     */
    let newElement;

    if (newObject.type === "text") {

        newElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        newElement.textContent =
            newObject.text || "";

        newElement.setAttribute(
            "x",
            newObject.x
        );

        newElement.setAttribute(
            "y",
            newObject.y
        );

        newElement.setAttribute(
            "font-size",
            newObject.fontSize || 12
        );

        newElement.setAttribute(
            "font-family",
            newObject.fontFamily || "sans-serif"
        );

        newElement.setAttribute(
            "font-weight",
            newObject.fontWeight || "400"
        );

        newElement.setAttribute(
            "fill",
            newObject.fill || "#222222"
        );

        newElement.setAttribute(
            "text-anchor",
            newObject.textAnchor || "middle"
        );

        newElement.setAttribute(
            "dominant-baseline",
            "middle"
        );

    } else {

        newElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        newElement.setAttribute(
            "href",
            newObject.src
        );

        newElement.setAttribute(
            "x",
            newObject.x
        );

        newElement.setAttribute(
            "y",
            newObject.y
        );

        newElement.setAttribute(
            "width",
            newObject.width
        );

        newElement.setAttribute(
            "height",
            newObject.height
        );

        newElement.setAttribute(
            "preserveAspectRatio",
            "none"
        );
    }

    newElement.classList.add(
        "canvas-object"
    );

    newElement.dataset.objectId =
        newObject.id;

    newElement.dataset.name =
        newObject.name;

    coverCanvas.appendChild(
        newElement
    );

    selectObject(
        newObject.id
    );

    updateLayerList();

    saveHistory();
}

/* =========================
   削除
========================= */

function deleteSelectedObject() {

    const objectId =
        state.selectedObjectId;

    if (!objectId) {
        return;
    }


    const objectElement =
        getObjectElement(objectId);


    if (objectElement) {
        objectElement.remove();
    }


    /*
     * データから削除
     */

    state.objects =
        state.objects.filter(
            (object) =>
                object.id !== objectId
        );


    state.selectedObjectId =
        null;


    clearSelectionVisual();


    updateLayerList();

    updatePropertiesPanel();

        saveHistory();

    if (floatingToolbar) {

        floatingToolbar.classList.remove(
            "active"
        );

    }

}


/* =========================
   表示 / 非表示
========================= */

function toggleObjectVisibility(
    objectId
) {

    const objectData =
        getObjectData(objectId);

    const objectElement =
        getObjectElement(objectId);


    if (
        !objectData ||
        !objectElement
    ) {
        return;
    }


    objectData.visible =
        !objectData.visible;


    objectElement.style.display =
        objectData.visible
            ? ""
            : "none";


    /*
     * 非表示にしたオブジェクトが
     * 選択中だった場合は選択解除
     */

    if (
        !objectData.visible &&
        state.selectedObjectId === objectId
    ) {

        deselectObject();

    }


    updateLayerList();

}


/* ==================================================
   TOOLBAR BUTTONS
================================================== */

const bringFrontButton =
    document.getElementById(
        "bring-front"
    );

const sendBackButton =
    document.getElementById(
        "send-back"
    );

const duplicateButton =
    document.getElementById(
        "duplicate-object"
    );

const deleteButton =
    document.getElementById(
        "delete-object"
    );


if (bringFrontButton) {

    bringFrontButton.addEventListener(
        "click",
        () => {

            bringSelectedToFront();

        }
    );

}


if (sendBackButton) {

    sendBackButton.addEventListener(
        "click",
        () => {

            sendSelectedToBack();

        }
    );

}


if (duplicateButton) {

    duplicateButton.addEventListener(
        "click",
        () => {

            duplicateSelectedObject();

        }
    );

}


if (deleteButton) {

    deleteButton.addEventListener(
        "click",
        () => {

            deleteSelectedObject();

        }
    );

}


/* ==================================================
   KEYBOARD SHORTCUTS
================================================== */

window.addEventListener(
    "keydown",
    (event) => {

        /*
         * 入力欄ではショートカットを
         * 動かさない。
         */

        const tag =
            event.target.tagName;


        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT"
        ) {
            return;
        }


        /*
         * Delete / Backspace
         */

        if (
            event.key === "Delete" ||
            event.key === "Backspace"
        ) {

            if (
                state.selectedObjectId
            ) {

                event.preventDefault();

                deleteSelectedObject();

            }

            return;
        }


        /*
         * Ctrl + ]
         * 前面
         */

        if (
            event.ctrlKey &&
            event.key === "]"
        ) {

            event.preventDefault();

            bringSelectedToFront();

            return;
        }


        /*
         * Ctrl + [
         * 背面
         */

        if (
            event.ctrlKey &&
            event.key === "["
        ) {

            event.preventDefault();

            sendSelectedToBack();

            return;
        }


        /*
         * Ctrl + D
         * 複製
         */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            duplicateSelectedObject();

        }

    }
);


/* ==================================================
   LAYER LIST
================================================== */

layerList.addEventListener(
    "click",
    (event) => {

        const layer =
            event.target.closest(
                ".layer-item"
            );


        if (!layer) {
            return;
        }


        const objectId =
            layer.dataset.objectId;


        /*
         * 👁 を押した場合
         */

        if (
            event.target.closest(
                ".layer-visibility"
            )
        ) {

            toggleObjectVisibility(
                objectId
            );

            return;
        }


        /*
         * 名前部分を押した場合
         * → 選択
         */

        selectObject(
            objectId
        );

    }
);

/* ==================================================
   HISTORY / UNDO / REDO
================================================== */

const undoButton =
    document.getElementById("undo-button");

const redoButton =
    document.getElementById("redo-button");


/* =========================
   現在の状態を保存
========================= */

function createHistorySnapshot() {

    return JSON.stringify({

        notebook:
            state.notebook,

        background:
            state.background,

        objects:
            state.objects

    });

}

/* =========================
   履歴に追加
========================= */

function saveHistory() {

    const snapshot =
        createHistorySnapshot();


    /*
     * 現在位置より後ろの履歴を削除
     *
     * Undoしたあとに新しい操作をした場合、
     * Redoできなくするため。
     */

    state.history =
        state.history.slice(
            0,
            state.historyIndex + 1
        );


    state.history.push(
        snapshot
    );


    state.historyIndex =
        state.history.length - 1;


    updateHistoryButtons();

}


/* =========================
   状態を復元
========================= */

function restoreHistorySnapshot(
    snapshot
) {

    const data =
        JSON.parse(snapshot);


    state.notebook =
    data.notebook;


    state.background =
        data.background ||
        state.background;


    state.objects =
        data.objects;

    state.selectedObjectId =
        null;


    /*
     * キャンバス上のオブジェクトを
     * 全削除
     */

    coverCanvas
        .querySelectorAll(
            ".canvas-object"
        )
        .forEach(
            (element) => {
                element.remove();
            }
        );


    /*
     * リサイズハンドルも削除
     */

    selectedHandleElements.forEach(
        (handle) => {
            handle.remove();
        }
    );


    selectedHandleElements = [];


    /*
     * キャンバスサイズを復元
     */

    setNotebookSize(
        state.notebook.width,
        state.notebook.height,
        state.notebook.unit
    );


    /*
     * オブジェクトを再生成
     */

    state.objects.forEach(
        (object) => {

            const image =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "image"
                );


            image.classList.add(
                "canvas-object"
            );


            image.dataset.objectId =
                object.id;

            image.dataset.name =
                object.name;


            image.setAttribute(
                "href",
                object.src
            );


            image.setAttribute(
                "x",
                object.x
            );

            image.setAttribute(
                "y",
                object.y
            );

            image.setAttribute(
                "width",
                object.width
            );

            image.setAttribute(
                "height",
                object.height
            );


            image.setAttribute(
                "preserveAspectRatio",
                "none"
            );


            if (
                !object.visible
            ) {

                image.style.display =
                    "none";

            }


            coverCanvas.appendChild(
                image
            );

        }
    );

    syncBackgroundControls();





    updateLayerList();

    updatePropertiesPanel();

    updateHistoryButtons();

}



/* =========================
   Undo
========================= */

function undo() {

    if (
        state.historyIndex <= 0
    ) {
        return;
    }


    state.historyIndex--;


    const snapshot =
        state.history[
            state.historyIndex
        ];


    restoreHistorySnapshot(
        snapshot
    );

}


/* =========================
   Redo
========================= */

function redo() {

    if (
        state.historyIndex >=
        state.history.length - 1
    ) {
        return;
    }


    state.historyIndex++;


    const snapshot =
        state.history[
            state.historyIndex
        ];


    restoreHistorySnapshot(
        snapshot
    );

}


/* =========================
   ボタン状態
========================= */

function updateHistoryButtons() {

    if (undoButton) {

        undoButton.disabled =
            state.historyIndex <= 0;

    }


    if (redoButton) {

        redoButton.disabled =
            state.historyIndex >=
            state.history.length - 1;

    }

}


/* =========================
   ボタン
========================= */

if (undoButton) {

    undoButton.addEventListener(
        "click",
        undo
    );

}


if (redoButton) {

    redoButton.addEventListener(
        "click",
        redo
    );

}


/* =========================
   キーボード
========================= */

window.addEventListener(
    "keydown",
    (event) => {

        const tag =
            event.target.tagName;


        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT"
        ) {
            return;
        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "z"
        ) {

            event.preventDefault();

            undo();

            return;
        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "y"
        ) {

            event.preventDefault();

            redo();

        }

    }
);

/* ==================================================
   INITIALIZE
================================================== */

setNotebookSize(
    148,
    210,
    "mm"
);


/*
 * A5を選択状態
 */

document
    .querySelector(
        '.size-card[data-width="148"][data-height="210"]'
    )
    ?.classList.add(
        "selected"
    );


/*
 * テンプレート表示
 */

renderTemplates();


/*
 * 最初のカテゴリー
 */

renderFrameCategory(
    "band"
);


/*
 * 初期レイヤー
 */

updateLayerList();


/*
 * 初期プロパティ
 */

updatePropertiesPanel();

syncBackgroundControls();

applyBackground();

saveHistory();

console.log(
    "NOTE COVER MAKER V2 initialized."
);

/* ==================================================
   BACKGROUND COLOR
================================================== */

const backgroundColor =
    document.getElementById("background-color");

const canvasBackground =
    document.getElementById("canvas-background");


if (backgroundColor && canvasBackground) {

    backgroundColor.addEventListener(
        "input",
        () => {

            const color =
                backgroundColor.value;

            /*
             * インラインスタイルで直接反映
             * CSSより優先される
             */
            canvasBackground.style.fill =
                color;

        }
    );

}

/* ==================================================
   GRADIENT MODE SWITCH
================================================== */

document
    .querySelectorAll(".background-type-button")
    .forEach((button) => {

        button.addEventListener("click", () => {

            if (
                button.dataset.backgroundType !==
                "gradient"
            ) {
                return;
            }

            const bg =
                document.getElementById(
                    "canvas-background"
                );

            const color1 =
                document.getElementById(
                    "gradient-color-1"
                );

            const color2 =
                document.getElementById(
                    "gradient-color-2"
                );

            const angleInput =
                document.getElementById(
                    "gradient-angle"
                );

            if (
                !bg ||
                !color1 ||
                !color2 ||
                !angleInput
            ) {
                return;
            }

            const svg =
                document.getElementById(
                    "cover-canvas"
                );

            let defs =
                svg.querySelector("defs");

            if (!defs) {
                defs =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "defs"
                    );

                svg.insertBefore(
                    defs,
                    svg.firstChild
                );
            }

            let gradient =
                document.getElementById(
                    "background-gradient"
                );

            if (!gradient) {

                gradient =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "linearGradient"
                    );

                gradient.setAttribute(
                    "id",
                    "background-gradient"
                );

                defs.appendChild(
                    gradient
                );
            }

            const angle =
                Number(angleInput.value);

            const rad =
                (angle - 90) *
                Math.PI /
                180;

            gradient.setAttribute(
                "x1",
                `${50 - Math.cos(rad) * 50}%`
            );

            gradient.setAttribute(
                "y1",
                `${50 - Math.sin(rad) * 50}%`
            );

            gradient.setAttribute(
                "x2",
                `${50 + Math.cos(rad) * 50}%`
            );

            gradient.setAttribute(
                "y2",
                `${50 + Math.sin(rad) * 50}%`
            );

            gradient.innerHTML = `
                <stop
                    offset="0%"
                    stop-color="${color1.value}"
                />

                <stop
                    offset="100%"
                    stop-color="${color2.value}"
                />
            `;

            bg.style.fill =
                "url(#background-gradient)";
        });

    });

    /* ==================================================
   GRADIENT LIVE UPDATE
================================================== */

document
    .getElementById("gradient-color-1")
    ?.addEventListener("input", () => {

        const gradient =
            document.getElementById(
                "background-gradient"
            );

        const color =
            document.getElementById(
                "gradient-color-1"
            );

        if (
            gradient &&
            color
        ) {
            const stop =
                gradient.querySelector(
                    'stop[offset="0%"]'
                );

            if (stop) {
                stop.setAttribute(
                    "stop-color",
                    color.value
                );
            }
        }
    });


document
    .getElementById("gradient-color-2")
    ?.addEventListener("input", () => {

        const gradient =
            document.getElementById(
                "background-gradient"
            );

        const color =
            document.getElementById(
                "gradient-color-2"
            );

        if (
            gradient &&
            color
        ) {
            const stop =
                gradient.querySelector(
                    'stop[offset="100%"]'
                );

            if (stop) {
                stop.setAttribute(
                    "stop-color",
                    color.value
                );
            }
        }
    });


// ========================================
// STEP 04 : TITLE
// ========================================

const titleTextInput =
    document.getElementById("title-text");

const addTitleButton =
    document.getElementById("add-title-button");

if (addTitleButton) {

    addTitleButton.addEventListener(
        "click",
        () => {

            const text =
                titleTextInput.value.trim();

            if (!text) {
                return;
            }

            const objectId =
                createObjectId();

            const objectData = {

                id: objectId,

                type: "text",

                name: "タイトル",

                text: text,

                x:
                    state.notebook.width / 2,

                y:
                    state.notebook.height / 2,

                width: 60,

                height: 20,

                rotation: 0,

                visible: true,

                locked: false,

                fontSize: 12,

                fontFamily:
                    "sans-serif",

                fontWeight: "400",

                fill: "#222222",

                textAnchor: "middle"

            };

            state.objects.push(
                objectData
            );


            // SVGの文字を作る
            const textElement =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );

            textElement.classList.add(
                "canvas-object"
            );

            textElement.dataset.objectId =
                objectId;

            textElement.dataset.name =
                objectData.name;

            textElement.setAttribute(
                "x",
                objectData.x
            );

            textElement.setAttribute(
                "y",
                objectData.y
            );

            textElement.setAttribute(
                "font-size",
                objectData.fontSize
            );

            textElement.setAttribute(
                "font-family",
                objectData.fontFamily
            );

            textElement.setAttribute(
                "font-weight",
                objectData.fontWeight
            );

            textElement.setAttribute(
                "fill",
                objectData.fill
            );

            textElement.setAttribute(
                "text-anchor",
                objectData.textAnchor
            );

            textElement.setAttribute(
                "dominant-baseline",
                "middle"
            );

            textElement.textContent =
                objectData.text;


            coverCanvas.appendChild(
                textElement
            );


            selectObject(
                objectId
            );

            updateLayerList();

            saveHistory();

            titleTextInput.value = "";

        }
    );

}


function updateFinishPanel() {

    const layerList =
        document.getElementById(
            "finish-layer-list"
        );

    const selectedInfo =
        document.getElementById(
            "finish-selected-info"
        );


    // =========================================
    // レイヤー一覧
    // =========================================

    if (layerList) {

        layerList.innerHTML = "";


        // オブジェクトがない場合
        if (state.objects.length === 0) {

            layerList.innerHTML = `
                <p class="finish-empty">
                    まだ素材がありません。
                </p>
            `;

        } else {

            // 上にあるものを上に表示
            const objects =
                [...state.objects].reverse();


            objects.forEach((object, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "finish-layer-item";


                // 選択中ならactive
                if (
                    object.id ===
                    state.selectedObjectId
                ) {

                    item.classList.add(
                        "active"
                    );

                }


                // 表示状態
                const visibility =
                    object.visible !== false
                        ? "👁"
                        : "○";


                // オブジェクト名
                let objectName =
                    object.name ||
                    "素材";


                // タイトルの場合
                if (
                    object.type === "text" &&
                    object.text
                ) {

                    objectName =
                        `タイトル：${object.text}`;

                }


                item.innerHTML = `
                    <button
                        type="button"
                        class="finish-layer-visibility"
                        data-object-id="${object.id}"
                    >
                        ${visibility}
                    </button>

                    <button
                        type="button"
                        class="finish-layer-name"
                        data-object-id="${object.id}"
                    >
                        ${objectName}
                    </button>
                `;


                // レイヤー選択
                const nameButton =
                    item.querySelector(
                        ".finish-layer-name"
                    );

                nameButton.addEventListener(
                    "click",
                    () => {

                        selectObject(
                            object.id
                        );

                        updateFinishPanel();

                    }
                );


                // 表示・非表示
                const visibilityButton =
                    item.querySelector(
                        ".finish-layer-visibility"
                    );

                visibilityButton.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        object.visible =
                            object.visible === false;

                        const element =
                            getObjectElement(
                                object.id
                            );

                        if (element) {

                            element.style.display =
                                object.visible
                                    ? ""
                                    : "none";

                        }

                        saveHistory();

                        updateLayerList();
                        updateFinishPanel();

                    }
                );


                layerList.appendChild(item);

            });

        }

    }


    // =========================================
    // 選択中の素材
    // =========================================

    if (selectedInfo) {

        const selectedObject =
            getObjectData(
                state.selectedObjectId
            );


        if (!selectedObject) {

            selectedInfo.textContent =
                "素材を選択してください。";

        } else {

            let name =
                selectedObject.name ||
                "素材";


            if (
                selectedObject.type === "text" &&
                selectedObject.text
            ) {

                name =
                    `タイトル：${selectedObject.text}`;

            }


            selectedInfo.innerHTML = `
                <strong>${name}</strong>
                <br>
                X：${Math.round(selectedObject.x)}
                ／
                Y：${Math.round(selectedObject.y)}
                <br>
                幅：${Math.round(selectedObject.width)}
                ／
                高さ：${Math.round(selectedObject.height)}
                <br>
                回転：${Math.round(selectedObject.rotation || 0)}°
            `;

        }

    }

}

/* ==================================================
   STEP 06 : EXPORT PREVIEW
================================================== */

function updateExportPreview() {

    const preview =
        document.getElementById("export-preview-canvas");

    const previewBackground =
        document.getElementById("export-preview-background");

    if (!preview) {
        return;
    }

    const width = state.notebook.width;
    const height = state.notebook.height;

    /* =========================
       プレビュー設定
    ========================= */

    preview.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

    preview.setAttribute("width", width);
    preview.setAttribute("height", height);

    /* =========================
       古い内容を完全削除
    ========================= */

    preview.innerHTML = "";

    /* =========================
       メインキャンバスを丸ごとコピー
    ========================= */

    const clone =
        coverCanvas.cloneNode(true);

    /* =========================
       選択状態を削除
    ========================= */

    clone
        .querySelectorAll(".selected-object")
        .forEach((element) => {
            element.classList.remove("selected-object");
        });

    /* =========================
       操作用ハンドルを削除
    ========================= */

    clone
        .querySelectorAll(
            ".resize-handle, .rotate-handle"
        )
        .forEach((element) => {
            element.remove();
        });

    /* =========================
       非表示オブジェクトを削除
    ========================= */

    state.objects.forEach((object) => {

        if (object.visible === false) {

            const element =
                clone.querySelector(
                    `[data-object-id="${object.id}"]`
                );

            if (element) {
                element.remove();
            }
        }
    });

    /* =========================
       プレビューサイズ
    ========================= */

    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    clone.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

    /* =========================
       コピーを表示
    ========================= */

    preview.appendChild(clone);

}

/* ==================================================
   PNG EXPORT
================================================== */

async function exportPNG() {

    const width = state.notebook.width;
    const height = state.notebook.height;

    /* =========================
       SVGを複製
    ========================= */

    const svg =
        coverCanvas.cloneNode(true);

    /* =========================
       選択状態を削除
    ========================= */

    svg
        .querySelectorAll(".selected-object")
        .forEach((element) => {
            element.classList.remove("selected-object");
        });


    /* =========================
       操作ハンドルを削除
    ========================= */

    svg
        .querySelectorAll(
            ".resize-handle, .rotate-handle"
        )
        .forEach((element) => {
            element.remove();
        });


    /* =========================
       非表示オブジェクトを削除
    ========================= */

    state.objects.forEach((object) => {

        if (object.visible === false) {

            const element =
                svg.querySelector(
                    `[data-object-id="${object.id}"]`
                );

            if (element) {
                element.remove();
            }
        }
    });


    /* =========================
       SVGサイズ
    ========================= */

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

    svg.setAttribute(
        "xmlns",
        "http://www.w3.org/2000/svg"
    );

    svg.setAttribute(
        "xmlns:xlink",
        "http://www.w3.org/1999/xlink"
    );


    /* =========================
       SVG内の画像をData URL化
    ========================= */

    const imageElements =
        svg.querySelectorAll("image");

    for (const element of imageElements) {

        const href =
            element.getAttribute("href") ||
            element.getAttribute("xlink:href");

        if (!href || href.startsWith("data:")) {
            continue;
        }

        try {

            const image =
                new Image();

            image.src = href;

            await new Promise(
                (resolve, reject) => {

                    image.onload = resolve;
                    image.onerror = reject;

                }
            );


            /* =========================
               一時Canvasへ描画
            ========================= */

            const tempCanvas =
                document.createElement("canvas");

            tempCanvas.width =
                image.naturalWidth;

            tempCanvas.height =
                image.naturalHeight;

            const tempContext =
                tempCanvas.getContext("2d");

            tempContext.drawImage(
                image,
                0,
                0
            );


            const dataUrl =
                tempCanvas.toDataURL(
                    "image/png"
                );


            element.setAttribute(
                "href",
                dataUrl
            );

            element.setAttribute(
                "xlink:href",
                dataUrl
            );

        } catch (error) {

            console.error(
                "画像変換エラー:",
                href,
                error
            );

            alert(
                "画像の書き出しに失敗しました。"
            );

            return;
        }
    }


    /* =========================
       SVG → Blob
    ========================= */

    const serializer =
        new XMLSerializer();

    const svgString =
        serializer.serializeToString(svg);

    const svgBlob =
        new Blob(
            [svgString],
            {
                type:
                    "image/svg+xml;charset=utf-8"
            }
        );

    const svgUrl =
        URL.createObjectURL(svgBlob);


    /* =========================
       SVG → PNG
    ========================= */

    try {

        const image =
            new Image();

        image.src = svgUrl;

        await new Promise(
            (resolve, reject) => {

                image.onload = resolve;
                image.onerror = reject;

            }
        );


        const canvas =
            document.createElement("canvas");

        canvas.width =
            width * 4;

        canvas.height =
            height * 4;


        const context =
            canvas.getContext("2d");

        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* =========================
           PNG生成
        ========================= */

        const blob =
            await new Promise(
                (resolve) => {

                    canvas.toBlob(
                        resolve,
                        "image/png"
                    );

                }
            );


        if (!blob) {
            throw new Error(
                "PNG生成失敗"
            );
        }


        /* =========================
           保存
        ========================= */

        const downloadUrl =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href =
            downloadUrl;

        link.download =
            `note-cover-${Date.now()}.png`;

        link.click();


        URL.revokeObjectURL(
            downloadUrl
        );

    } catch (error) {

        console.error(
            "PNG書き出しエラー:",
            error
        );

        alert(
            "画像の書き出しに失敗しました。"
        );

    } finally {

        URL.revokeObjectURL(
            svgUrl
        );
    }
}

/* ==================================================
   PROJECT SAVE
================================================== */

function saveProject() {

    const projectData = {

        version: "NOTE COVER MAKER V2",

        notebook:
            state.notebook,

        background:
            state.background,

        objects:
            state.objects

    };


    const json =
        JSON.stringify(
            projectData,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        `note-cover-project-${Date.now()}.json`;

    link.click();

    URL.revokeObjectURL(
        url
    );

}

/* ==================================================
   LOAD PROJECT
================================================== */

function loadProject(event) {

    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = () => {

        try {

            const data =
                JSON.parse(reader.result);


            /* =========================
               データチェック
            ========================= */

            if (
                !data ||
                !data.notebook ||
                !data.background ||
                !Array.isArray(data.objects)
            ) {
                throw new Error(
                    "制作データの形式が正しくありません。"
                );
            }


            /* =========================
               現在のキャンバスを完全クリア
            ========================= */

            clearSelectionVisual();

            state.selectedObjectId = null;

            coverCanvas
                .querySelectorAll(".canvas-object")
                .forEach((element) => {
                    element.remove();
                });

            const oldBackgroundImage =
                coverCanvas.querySelector(
                    "#background-image-element"
                );

            if (oldBackgroundImage) {
                oldBackgroundImage.remove();
            }


            /* =========================
               データ復元
            ========================= */

            state.notebook =
                structuredClone(data.notebook);

            state.background = {
                type:
                    data.background.type || "color",

                color:
                    data.background.color || "#FFFFFF",

                gradientColor1:
                    data.background.gradientColor1 || "#FFFFFF",

                gradientColor2:
                    data.background.gradientColor2 || "#E8E3D8",

                gradientAngle:
                    data.background.gradientAngle ?? 90,

                image:
                    data.background.image || null,

                imageAspectRatio:
                    data.background.imageAspectRatio ?? null,

                imageX:
                    data.background.imageX ?? 0,

                imageY:
                    data.background.imageY ?? 0,

                imageScale:
                    data.background.imageScale ?? 1,

                imageBrightness:
                    data.background.imageBrightness ?? 100,

                imageContrast:
                    data.background.imageContrast ?? 100,

                imageSaturation:
                    data.background.imageSaturation ?? 100,

                imageSepia:
                    data.background.imageSepia ?? 0,

                imageHue:
                    data.background.imageHue ?? 0
            };

            state.objects =
                structuredClone(data.objects);


            /* =========================
               ノートサイズ復元
            ========================= */

            setNotebookSize(
                state.notebook.width,
                state.notebook.height,
                state.notebook.unit
            );


            /* =========================
               背景復元
            ========================= */

            applyBackground();
            syncBackgroundControls();


            /* =========================
               オブジェクト復元
            ========================= */

            state.objects.forEach(
                (objectData) => {

                    /* =====================
                       TEXT
                    ===================== */

                    if (objectData.type === "text") {

                        const text =
                            document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "text"
                            );

                        text.classList.add(
                            "canvas-object"
                        );

                        text.dataset.objectId =
                            objectData.id;

                        text.dataset.name =
                            objectData.name ||
                            "タイトル";

                        text.textContent =
                            objectData.text || "";

                        text.setAttribute(
                            "x",
                            objectData.x ?? 0
                        );

                        text.setAttribute(
                            "y",
                            objectData.y ?? 0
                        );

                        text.setAttribute(
                            "font-size",
                            objectData.fontSize || 12
                        );

                        text.setAttribute(
                            "font-family",
                            objectData.fontFamily ||
                            "sans-serif"
                        );

                        text.setAttribute(
                            "font-weight",
                            objectData.fontWeight ||
                            "400"
                        );

                        text.setAttribute(
                            "fill",
                            objectData.fill ||
                            "#222222"
                        );

                        text.setAttribute(
                            "text-anchor",
                            objectData.textAnchor ||
                            "middle"
                        );

                        text.setAttribute(
                            "dominant-baseline",
                            "middle"
                        );

                        if (objectData.rotation) {

                            text.setAttribute(
                                "transform",
                                `rotate(
                                    ${objectData.rotation}
                                    ${objectData.x}
                                    ${objectData.y}
                                )`
                            );
                        }

                        if (
                            objectData.visible === false
                        ) {
                            text.style.display =
                                "none";
                        }

                        coverCanvas.appendChild(
                            text
                        );

                        return;
                    }


                    /* =====================
                       IMAGE
                    ===================== */

                    if (objectData.type === "image") {

                        const image =
                            document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "image"
                            );

                        image.classList.add(
                            "canvas-object"
                        );

                        image.dataset.objectId =
                            objectData.id;

                        image.dataset.name =
                            objectData.name ||
                            "素材";

                        image.setAttribute(
                            "href",
                            objectData.src || ""
                        );

                        image.setAttribute(
                            "x",
                            objectData.x ?? 0
                        );

                        image.setAttribute(
                            "y",
                            objectData.y ?? 0
                        );

                        image.setAttribute(
                            "width",
                            objectData.width ??
                            state.notebook.width
                        );

                        image.setAttribute(
                            "height",
                            objectData.height ??
                            state.notebook.height
                        );

                        image.setAttribute(
                            "preserveAspectRatio",
                            "none"
                        );


                        /* =================
                           フレーム色調
                        ================= */

                        image.style.filter = `
                            brightness(${objectData.brightness ?? 100}%)
                            contrast(${objectData.contrast ?? 100}%)
                            saturate(${objectData.saturation ?? 100}%)
                            sepia(${objectData.sepia ?? 0}%)
                            hue-rotate(${objectData.hue ?? 0}deg)
                        `;


                        /* =================
                           回転
                        ================= */

                        if (objectData.rotation) {

                            const centerX =
                                (objectData.x ?? 0) +
                                (objectData.width ?? state.notebook.width) / 2;

                            const centerY =
                                (objectData.y ?? 0) +
                                (objectData.height ?? state.notebook.height) / 2;

                            image.setAttribute(
                                "transform",
                                `rotate(
                                    ${objectData.rotation}
                                    ${centerX}
                                    ${centerY}
                                )`
                            );
                        }


                        /* =================
                           表示状態
                        ================= */

                        if (
                            objectData.visible === false
                        ) {
                            image.style.display =
                                "none";
                        }


                        coverCanvas.appendChild(
                            image
                        );
                    }
                }
            );


            /* =========================
               UI更新
            ========================= */

            updateLayerList();
            updatePropertiesPanel();
            updateFinishPanel();
            updateExportPreview();


            /* =========================
               履歴リセット
            ========================= */

            state.history = [];
            state.historyIndex = -1;

            saveHistory();


            /* =========================
               STEP05へ
            ========================= */

            goToStep(5);


            alert(
                "制作データを読み込みました。"
            );


        } catch (error) {

            console.error(
                "Project load error:",
                error
            );

            alert(
                "制作データを読み込めませんでした。\n\n" +
                error.message
            );
        }


        /*
         * 同じファイルをもう一度選択できるようにする
         */

        event.target.value = "";
    };


    reader.readAsText(file);
}


/* ==================================================
   RESET PROJECT
================================================== */

function resetProject() {

    const confirmed = window.confirm(
        "現在のデザインをすべて削除して、最初から作り直しますか？"
    );

    if (!confirmed) {
        return;
    }

    /* =========================
       状態を完全リセット
    ========================= */

    state.objects = [];
    state.selectedObjectId = null;

    state.background = {
        type: "color",
        color: "#FFFFFF",

        gradientColor1: "#FFFFFF",
        gradientColor2: "#E8E3D8",
        gradientAngle: 90,

        image: null,
        imageAspectRatio: null,
        imageX: 0,
        imageY: 0,
        imageScale: 1,

        imageBrightness: 100,
        imageContrast: 100,
        imageSaturation: 100,
        imageSepia: 0,
        imageHue: 0
    };


    /* =========================
       メインキャンバスを完全クリア
    ========================= */

    clearSelectionVisual();

    coverCanvas
        .querySelectorAll(".canvas-object")
        .forEach((element) => {
            element.remove();
        });

    const backgroundImage =
        coverCanvas.querySelector("#background-image-element");

    if (backgroundImage) {
        backgroundImage.remove();
    }

    selectedHandleElements.forEach((handle) => {
        handle.remove();
    });

    selectedHandleElements = [];


    /* =========================
       背景を再構築
    ========================= */

    applyBackground();

    syncBackgroundControls();


    /* =========================
       UIを完全リセット
    ========================= */

    if (floatingToolbar) {
        floatingToolbar.classList.remove("active");
    }

    updateLayerList();
    updatePropertiesPanel();
    updateHistoryButtons();


    /* =========================
       書き出しプレビューもクリア
    ========================= */

    const preview =
        document.getElementById("export-preview-canvas");

    if (preview) {
        preview.innerHTML = "";
    }


    /* =========================
       履歴をリセット
    ========================= */

    state.history = [];
    state.historyIndex = -1;

    saveHistory();


    /* =========================
       最初のSTEPへ戻る
    ========================= */

    goToStep(1);
}

/* ==================================================
   EXPORT BUTTONS
================================================== */

if (exportPngButton) {

    exportPngButton.addEventListener(
        "click",
        exportPNG
    );

}

if (saveProjectButton) {

    saveProjectButton.addEventListener(
        "click",
        saveProject
    );

}

if (resetProjectButton) {

    resetProjectButton.addEventListener(
        "click",
        resetProject
    );

}

if (loadProjectInput) {

    loadProjectInput.addEventListener(
        "change",
        loadProject
    );

}

/* ==================================================
   BACKGROUND MATERIALS INITIALIZE
================================================== */

renderBackgroundCategories();
renderBackgroundMaterials();

function syncFrameControls() {
    const object = getObjectData(state.selectedObjectId);

    const controls = [
        ["frame-brightness", "frame-brightness-value", "brightness", "%"],
        ["frame-contrast", "frame-contrast-value", "contrast", "%"],
        ["frame-saturation", "frame-saturation-value", "saturation", "%"],
        ["frame-sepia", "frame-sepia-value", "sepia", "%"],
        ["frame-hue", "frame-hue-value", "hue", "°"]
    ];

    controls.forEach(([inputId, valueId, key, unit]) => {
        const input = document.getElementById(inputId);
        const value = document.getElementById(valueId);

        if (!input) return;

        const number =
            object && object.type === "image"
                ? (object[key] ?? (key === "hue" || key === "sepia" ? 0 : 100))
                : (key === "hue" || key === "sepia" ? 0 : 100);

        input.value = number;

        if (value) {
            value.textContent = `${number}${unit}`;
        }
    });
}