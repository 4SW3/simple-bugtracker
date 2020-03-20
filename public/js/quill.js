export const quillOptions = {
  opt: {
    // debug: 'info',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
        [{ color: [] }, { background: [] }]
      ]
    },
    placeholder: 'Make a comment...',
    readOnly: false,
    theme: 'snow'
  },
  optA: {
    // debug: 'info',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
        [{ color: [] }, { background: [] }]
      ]
    },
    placeholder: 'Make a comment...',
    readOnly: true,
    theme: 'snow'
  }
};
// optC: {
//   // debug: 'info',
//   modules: {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'],
//       ['link', 'blockquote', 'code-block', 'image'],
//       [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
//       [{ color: [] }, { background: [] }],
//       ['emoji']
//     ],
//     handlers: { emoji: function() {} },
//     'emoji-toolbar': true,
//     'emoji-textarea': true,
//     'emoji-shortname': true
//   },
//   placeholder: 'Make a comment...',
//   readOnly: true,
//   theme: 'snow'
// }
