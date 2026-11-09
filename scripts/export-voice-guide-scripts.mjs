// Export exactly the scripts the site's on-device voice buttons read.
// These files live in the owner's generated-audio inbox, not publicly on the website.
import {mkdir,writeFile} from 'node:fs/promises';
import {voiceGuideConfig} from '../marketing/voice-guides.mjs';
const out='D:/PrescottsBestConstruction/Assets/GENERATED_CONCEPTS_INBOX';
await mkdir(out,{recursive:true});
const names={
 '/holiday-lighting/design':'Holiday Designer Audio Guide',
 '/visual-design-preview':'Design Center Audio Guide',
 '/estimate':'Budget Explorer Audio Guide'
};
for(const [route,guide] of Object.entries(voiceGuideConfig)){
 const name=names[route];
 const filename=name+'.txt';
 const content=[
  'VOICEOVER SCRIPT — '+guide.title,
  '',
  'Recording name to use once you have made the audio: '+name+'.m4a',
  'Website page: '+route,
  '',
  'Voice style: Friendly, clear and patient, natural adult American English.',
  'Recording notes: About 105–120 words per minute, clear pauses between steps,',
  'no background music, no loud effects, and no introductory sound logo.',
  'Keep instructions exactly as written so they match the on-screen transcript.',
  '',
  '--- SPOKEN NARRATION ---',
  guide.intro,
  ...guide.steps,
  '--- END NARRATION ---',
  '',
  'After creating the M4A, place it in the same Generated Concepts Inbox.',
  'The site currently reads these steps aloud using the device voice.',
  'Once the approved M4A exists, the webpage can be configured to play it instead.'
 ].join('\n')+'\n';
 await writeFile(out+'/'+filename,content,'utf8');
 console.log('SCRIPT_READY',out+'/'+filename);
}
