const SUPABASE_URL =
    "https://qqwzqwrgsvqrfwotityh.supabase.co";

const SUPABASE_KEY =
    "qqwzqwrgsvqrfwotityh";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const fileInput =
    document.getElementById(
        "fileInput"
    );

const preview =
    document.getElementById(
        "preview"
    );

const uploadButton =
    document.getElementById(
        "uploadButton"
    );

const result =
    document.getElementById(
        "result"
    );


let selectedFile = null;


fileInput.addEventListener(
    "change",
    function () {

        selectedFile =
            this.files[0];

        if (!selectedFile) {
            return;
        }

        if (
            selectedFile.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Ukuran maksimal 5MB."
            );

            this.value = "";

            selectedFile = null;

            uploadButton.disabled =
                true;

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                preview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="Preview"
                    >
                `;

            };


        reader.readAsDataURL(
            selectedFile
        );


        uploadButton.disabled =
            false;

        result.innerHTML = "";

    }
);


uploadButton.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {
            return;
        }


        uploadButton.disabled =
            true;

        uploadButton.textContent =
            "Uploading...";


        const extension =
            selectedFile.name
                .split(".")
                .pop()
                .toLowerCase();


        const randomName =
            crypto.randomUUID();


        const fileName =
            `${randomName}.${extension}`;


        const filePath =
            fileName;


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from("photos")
                .upload(
                    filePath,
                    selectedFile,
                    {
                        contentType:
                            selectedFile.type,

                        upsert: false
                    }
                );


        if (error) {

            console.error(error);

            result.innerHTML =
                "❌ Upload gagal: " +
                error.message;

            uploadButton.disabled =
                false;

            uploadButton.textContent =
                "Upload Image";

            return;
        }


        const {
            data: publicData
        } =
            supabaseClient
                .storage
                .from("photos")
                .getPublicUrl(
                    filePath
                );


        const imageUrl =
            publicData.publicUrl;


        result.innerHTML = `
            <strong>
                ✓ Upload berhasil
            </strong>

            <br><br>

            <a
                href="${imageUrl}"
                target="_blank"
            >
                ${imageUrl}
            </a>

            <br><br>

            <button
                onclick="copyLink('${imageUrl}')"
                class="choose-button"
            >
                Copy Link
            </button>
        `;


        uploadButton.textContent =
            "Upload Image";

        uploadButton.disabled =
            false;

    }
);


function copyLink(url) {

    navigator.clipboard
        .writeText(url)
        .then(() => {

            alert(
                "Link berhasil disalin!"
            );

        });

}