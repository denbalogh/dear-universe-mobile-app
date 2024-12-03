const phrases = [
  "What else happened today? Write it down or record a quick thought!",
  "A picture is worth a thousand words — did you capture anything special today?",
  "Your day isn’t over yet. Why not add a voice note about what’s on your mind?",
  "Every moment counts. Snap a photo or jot down a quick memory to save it forever.",
  "Is there a sound or thought from today that’s worth sharing? Record it for the universe.",
  "Keep the story going — what other memory can you add with a picture or a few words?",
  "Don’t let a great moment slip away. Write about it, or capture it in a short video!",
  "The universe loves seeing your perspective — what did you notice today worth sharing?",
  "Did you experience something beautiful? Write it down or record your thoughts.",
  "Take a moment to reflect. Maybe there’s another photo or memory you’d like to add.",
  "Is there a sound, a voice, or a thought from today you’d like to keep forever?",
  "A picture, a word, or a quick recording — what else can make today’s story complete?",
  "What made you pause today? Capture it in a photo or a quick note for the universe.",
  "Don’t stop now! Record a thought, add an image, or describe another moment.",
  "What else deserves a place in today’s memories? Maybe a snapshot or a voice note?",
  "Have more to say? Let it flow in words, or capture the moment with a quick photo.",
  "What made today meaningful? Add another note, picture, or even a short video.",
  "The little things matter — snap a quick picture or write a short memory down.",
  "There’s always room for more. What other moment can you describe or record?",
  "Your day has layers — add another with a thought, photo, or sound to remember it.",
  "The universe is listening — share one more story, however you’d like to tell it.",
  "What stood out to you today? A voice recording or snapshot could capture it perfectly.",
  "A small moment can hold a lot of meaning — write it down or take a picture to remember.",
  "Your day isn’t complete yet. Add a little more, whether it’s a note or a video memory.",
  "Don’t let this moment fade — write about it, or share a picture that says it all.",
  "Another memory awaits. Capture it with a voice note, image, or a few words.",
  "What’s one more thing the universe should know about today? Write it or snap a photo.",
  "Your story is still unfolding. Add another chapter with an image, note, or sound.",
  "Let the universe see your day through your eyes — share a picture or another memory.",
];

export const getRandomPhrase = (phrasesToChooseFrom = phrases) => {
  return phrasesToChooseFrom[
    Math.floor(Math.random() * phrasesToChooseFrom.length)
  ];
};
