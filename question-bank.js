export const supportedLanguages=['en','tr','uz','ar'];

const vocabulary=[
['كِتَاب','book','kitap','kitob'],['قَلَم','pen','kalem','qalam'],['بَاب','door','kapı','eshik'],['نَافِذَة','window','pencere','deraza'],['كُرْسِيّ','chair','sandalye','stul'],['طَاوِلَة','table','masa','stol'],['بَيْت','house','ev','uy'],['مَدْرَسَة','school','okul','maktab'],['سَيَّارَة','car','araba','mashina'],['حَافِلَة','bus','otobüs','avtobus'],
['طَائِرَة','airplane','uçak','samolyot'],['قِطَار','train','tren','poyezd'],['مَاء','water','su','suv'],['قَهْوَة','coffee','kahve','qahva'],['شَاي','tea','çay','choy'],['خُبْز','bread','ekmek','non'],['تُفَّاحَة','apple','elma','olma'],['مَوْز','banana','muz','banan'],['بُرْتُقَال','orange','portakal','apelsin'],['حَلِيب','milk','süt','sut'],
['شَمْس','sun','güneş','quyosh'],['قَمَر','moon','ay','oy'],['سَمَاء','sky','gökyüzü','osmon'],['بَحْر','sea','deniz','dengiz'],['جَبَل','mountain','dağ','tog‘'],['طَرِيق','road','yol','yo‘l'],['مَدِينَة','city','şehir','shahar'],['سُوق','market','pazar','bozor'],['مُسْتَشْفَى','hospital','hastane','kasalxona'],['مَسْجِد','mosque','cami','masjid'],
['فُنْدُق','hotel','otel','mehmonxona'],['مَطْعَم','restaurant','restoran','restoran'],['غُرْفَة','room','oda','xona'],['مِفْتَاح','key','anahtar','kalit'],['هَاتِف','phone','telefon','telefon'],['حَقِيبَة','bag','çanta','sumka'],['قَمِيص','shirt','gömlek','ko‘ylak'],['حِذَاء','shoe','ayakkabı','poyabzal'],['يَد','hand','el','qo‘l'],['عَيْن','eye','göz','ko‘z'],
['رَأْس','head','baş','bosh'],['أَب','father','baba','ota'],['أُمّ','mother','anne','ona'],['أَخ','brother','erkek kardeş','aka'],['أُخْت','sister','kız kardeş','opa'],['صَدِيق','friend','arkadaş','do‘st'],['مُعَلِّم','teacher','öğretmen','o‘qituvchi'],['طَالِب','student','öğrenci','talaba'],['طَبِيب','doctor','doktor','shifokor'],['مُهَنْدِس','engineer','mühendis','muhandis'],
['كَبِير','big','büyük','katta'],['صَغِير','small','küçük','kichik'],['جَدِيد','new','yeni','yangi'],['قَدِيم','old','eski','eski'],['سَرِيع','fast','hızlı','tez'],['بَطِيء','slow','yavaş','sekin'],['جَمِيل','beautiful','güzel','chiroyli'],['حَارّ','hot','sıcak','issiq'],['بَارِد','cold','soğuk','sovuq'],['مَفْتُوح','open','açık','ochiq'],
['مُغْلَق','closed','kapalı','yopiq'],['هُنَا','here','burada','bu yerda'],['هُنَاك','there','orada','u yerda'],['اليَوْم','today','bugün','bugun'],['غَدًا','tomorrow','yarın','ertaga'],['صَبَاح','morning','sabah','ertalab'],['مَسَاء','evening','akşam','kechqurun'],['يَسَار','left','sol','chap'],['يَمِين','right','sağ','o‘ng'],['مُسْتَقِيم','straight','düz','to‘g‘ri']
];

const phrases=[
['مَرْحَبًا','Hello','Merhaba','Salom'],['أَهْلًا وَسَهْلًا','Welcome','Hoş geldiniz','Xush kelibsiz'],['شُكْرًا','Thank you','Teşekkür ederim','Rahmat'],['عَفْوًا','You are welcome','Rica ederim','Arzimaydi'],['مَعَ السَّلَامَة','Goodbye','Hoşça kalın','Xayr'],['صَبَاحُ الخَيْر','Good morning','Günaydın','Xayrli tong'],['مَسَاءُ الخَيْر','Good evening','İyi akşamlar','Xayrli kech'],['كَيْفَ حَالُكَ؟','How are you?','Nasılsınız?','Qalaysiz?'],['أَنَا بِخَيْر','I am fine','İyiyim','Men yaxshiman'],['مَا اسْمُكَ؟','What is your name?','Adınız ne?','Ismingiz nima?'],
['اِسْمِي','My name is','Benim adım','Mening ismim'],['مِنْ فَضْلِكَ','Please','Lütfen','Iltimos'],['نَعَم','Yes','Evet','Ha'],['لَا','No','Hayır','Yo‘q'],['لَا أَفْهَم','I do not understand','Anlamıyorum','Tushunmayapman'],['تَكَلَّمْ بِبُطْء','Speak slowly','Yavaş konuşun','Sekin gapiring'],['أَيْنَ؟','Where?','Nerede?','Qayerda?'],['بِكَمْ؟','How much?','Ne kadar?','Qancha?'],['أُرِيدُ','I want','İstiyorum','Men xohlayman'],['لَوْ سَمَحْتَ','Excuse me','Affedersiniz','Kechirasiz']
];

const numberWords=['وَاحِد','اِثْنَان','ثَلَاثَة','أَرْبَعَة','خَمْسَة','سِتَّة','سَبْعَة','ثَمَانِيَة','تِسْعَة','عَشَرَة'];
const localizedNumberNames={en:['one','two','three','four','five','six','seven','eight','nine','ten'],tr:['bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz','on'],uz:['bir','ikki','uch','to‘rt','besh','olti','yetti','sakkiz','to‘qqiz','o‘n']};
const promptTemplates={
  en:{word:x=>`Choose the Arabic word for “${x}”.`,phrase:x=>`Choose the Arabic expression for “${x}”.`,number:x=>`Choose the Arabic word for the number “${x}”.`},
  tr:{word:x=>`“${x}” için doğru Arapça kelimeyi seçin.`,phrase:x=>`“${x}” için doğru Arapça ifadeyi seçin.`,number:x=>`“${x}” sayısının Arapça karşılığını seçin.`},
  uz:{word:x=>`“${x}” so‘zining arabcha variantini tanlang.`,phrase:x=>`“${x}” iborasining arabcha variantini tanlang.`,number:x=>`“${x}” sonining arabcha variantini tanlang.`},
  ar:{word:x=>`اختر الكلمة العربية الصحيحة لمعنى «${x}».`,phrase:x=>`اختر العبارة العربية الصحيحة لمعنى «${x}».`,number:x=>`اختر الكلمة العربية الصحيحة للعدد «${x}».`}
};
const images=['/assets/book.svg','/assets/coffee.png','/assets/saudi-learning.svg','/assets/apple.svg'];

const makeItems=(rows,type,start)=>rows.map((row,index)=>({id:start+index,type,answer:row[0],clues:{en:row[1],tr:row[2],uz:row[3]},image:type==='phrase'?'/assets/speech.svg':images[index%images.length]}));
const words=makeItems(vocabulary,'word',1);
const expressions=makeItems(phrases,'phrase',71);
const numbers=numberWords.map((answer,index)=>({id:91+index,type:'number',answer,clues:{en:localizedNumberNames.en[index],tr:localizedNumberNames.tr[index],uz:localizedNumberNames.uz[index]},image:index===2?'/assets/three.svg':'/assets/saudi-learning.svg'}));
export const questionBank=[...words,...expressions,...numbers];

if(questionBank.length!==100)throw new Error(`Question bank must contain 100 questions, found ${questionBank.length}`);

export function localizeQuestion(item,language='en'){
  const lang=supportedLanguages.includes(language)?language:'en';
  const group=questionBank.filter(q=>q.type===item.type);
  const position=group.findIndex(q=>q.id===item.id);
  const distractors=[group[(position+7)%group.length].answer,group[(position+19)%group.length].answer];
  const clue=lang==='ar'?item.clues.en:item.clues[lang];
  return{id:item.id,prompt:promptTemplates[lang][item.type](clue),word:item.type==='number'?String(item.id-90):clue,image:item.image,options:[item.answer,...distractors]};
}
