# ocr_server

need tesseract 5.0.0 ver

in tesseract/tessdata please download eng_b.traineddata

need python3, and download package we used

in ocr_server/bin you make pem key (private.pem, public.pem) with openSSL

-command

openssl genrsa -out private.pem 2048

openssl rsa -in private.pem -pubout -out public.pem

and make config.js in ocr_server

module.exports = {
    private_key : 'private.pem',
    public_key : 'public.pem',
    gs_key : 'your google cloud storage key'
}

