module.exports = {
    pages: {
      popup: {
        // entry for the page
        entry: 'src/main-popup.js',
        // the source template
        template: 'public/index.html',
        // output as dist/index.html
        filename: 'popup.html',
        // when using title option,
        // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Popup Page',
        // chunks to include on this page, by default includes
        // extracted common chunks and vendor chunks.
        chunks: ['chunk-vendors', 'chunk-common', 'popup']
      },
      options: {
        // entry for the page
        entry: 'src/main-options.js',
        // the source template
        template: 'public/index.html',
        // output as dist/index.html
        filename: 'options.html',
        // when using title option,
        // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Options Page',
        // chunks to include on this page, by default includes
        // extracted common chunks and vendor chunks.
        chunks: ['chunk-vendors', 'chunk-common', 'options']
    }
  }
}