// Script de automação para otimizar imagens, minificar CSS/JS e adicionar meta tags

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sharp = require('sharp');
const { minify } = require('terser');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const optimizeImages = async (inputDir, outputDir) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.readdirSync(inputDir).forEach(file => {
        const inputFile = path.join(inputDir, file);
        const outputFile = path.join(outputDir, file);
        sharp(inputFile)
            .resize(1024)
            .toFile(outputFile, (err) => {
                if (err) console.error(err);
                else console.log(`Imagem otimizada: ${file}`);
            });
    });
};

const addMetaTags = (htmlPath) => {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);
    $('head').append(`
        <meta name="description" content="Descrição do site">
        <meta name="keywords" content="palavras-chave">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    `);
    fs.writeFileSync(htmlPath, $.html());
    console.log('Meta tags adicionadas!');
};

const processCSS = async (cssPath) => {
    const css = fs.readFileSync(cssPath, 'utf8');
    const result = await postcss([autoprefixer, cssnano]).process(css, { from: cssPath, to: cssPath });
    fs.writeFileSync(cssPath.replace('.css', '.min.css'), result.css);
    console.log('CSS processado e minificado!');
};

const processJS = async (jsPath) => {
    const js = fs.readFileSync(jsPath, 'utf8');
    const result = await minify(js);
    fs.writeFileSync(jsPath.replace('.js', '.min.js'), result.code);
    console.log('JavaScript minificado!');
};

// Execução das tarefas
(async () => {
    await optimizeImages('./assets', './optimized_images');
    addMetaTags('./index.html');
    await processCSS('./css/style.css');
    console.log('Automação concluída!');
})();
