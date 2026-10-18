# Add your drawings here

Place JPG, JPEG, PNG or WebP images in this folder. Use short, case-sensitive filenames without spaces, for example `pencil-portrait.jpg`.

Next, open `src/contents.js`. In `sections.drawings.items`, add one object per image:

```js
{
  title: 'Pencil portrait',
  body: 'Graphite on paper · 2026',
  image: 'attachments/drawings/pencil-portrait.jpg'
},
```

The image path starts at the portfolio root (beside index.html), not beside contents.js. Copying a file alone will not add it to the website: each drawing needs an entry. Add a comma between entries. The first three entries have thumbnail buttons beside the graph; all entries are accessible as individual graph nodes or through View all Drawings. Opening an entry displays the full drawing. Save contents.js and refresh the page after edits.
