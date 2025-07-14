function VotePage_add_com(input, setInput, comments, setComments) {
  if (input.trim() === '') return;

  const newComment = {
    id: Date.now(),
    nickName: '나',
    time: 'sysdate',
    text: input,
    date: 'YY/MM/DD',
    profileImg: 'https://via.placeholder.com/40',
  };
  setComments([...comments, newComment]);
  setInput('');
}

export default VotePage_add_com;
