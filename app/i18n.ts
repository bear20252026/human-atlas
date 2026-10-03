import {useSyncExternalStore} from 'react';
import {SYSTEMS,EXPLANATIONS,type SystemId,type View} from './anatomy';
import {TERM_ZH} from './i18n/terms';

export type Locale='en'|'zh';

const STORAGE_KEY='human-atlas-locale';

function initialLocale():Locale{
 try{const saved=localStorage.getItem(STORAGE_KEY);if(saved==='zh'||saved==='en')return saved;}catch{}
 return typeof navigator!=='undefined'&&navigator.language.toLowerCase().startsWith('zh')?'zh':'en';
}

let current:Locale=initialLocale();
const listeners=new Set<()=>void>();

export function getLocale():Locale{return current;}
export function setLocale(next:Locale){
 if(next===current)return;
 current=next;
 try{localStorage.setItem(STORAGE_KEY,next);}catch{}
 listeners.forEach(emit=>emit());
}
function subscribeLocale(emit:()=>void){listeners.add(emit);return()=>{listeners.delete(emit);};}
export function useLocale():Locale{return useSyncExternalStore(subscribeLocale,getLocale,getLocale);}

/* Display helpers that never block rendering: unknown terms fall back to English. */
export function translateName(name:string,locale:Locale):string{
 return locale==='zh'?TERM_ZH[name]??name:name;
}
export function hasChinese(name:string):boolean{
 const zh=TERM_ZH[name];
 return zh!==undefined&&zh!==name;
}
/** Names in the source atlas are canonical English keys for EXPLANATIONS. */
export function explain(name:string,system:SystemId,locale:Locale):string{
 if(locale==='zh')return EXPLANATIONS_ZH[name.toLowerCase()]??SYSTEM_ZH[system].description;
 return EXPLANATIONS[name.toLowerCase()]??SYSTEMS.find(s=>s.id===system)?.description??'';
}
export function systemName(id:SystemId,englishName:string,locale:Locale):string{
 return locale==='zh'?SYSTEM_ZH[id].name:englishName;
}

export const SYSTEM_ZH:Record<SystemId,{name:string;description:string}>={
 skeletal:{name:'骨骼',description:'骨骼构成人体的支撑框架，保护内脏器官，并为肌肉提供附着点。骨内组织还负责储存矿物质和造血。'},
 muscular:{name:'肌肉',description:'骨骼肌通过牵拉附着点产生运动。肌肉与肌腱协同作用，牵动关节、维持姿势并产生热量。'},
 cardiac:{name:'心脏',description:'心脏是一个由四个腔室组成的肌肉泵。瓣膜引导血液沿肺循环和体循环单向流动。'},
 sensory:{name:'感觉器官',description:'这些结构参与视觉、听觉和平衡等特殊感觉。其特化组织感受刺激，并与神经系统协同传递信息。'},
 arterial:{name:'动脉',description:'心脏推动血液参与循环。动脉将血液从心脏输送到全身组织，在肺循环中则将血液送往肺部。'},
 venous:{name:'静脉',description:'静脉将血液送回心脏。浅静脉和深静脉网络从组织中收集血液；肺静脉将含氧血从肺部送回心脏。'},
 nervous:{name:'神经系统',description:'脑、脊髓和周围神经负责传递和处理信号，支撑感觉、运动、协调以及身体功能的自动调节。'},
 respiratory:{name:'呼吸系统',description:'气道将空气导入肺部，氧气和二氧化碳在肺泡处于空气与血液之间交换。呼吸依赖呼吸肌收缩产生的压力变化。'},
 digestive:{name:'消化系统',description:'消化道分解食物、吸收营养和水分，并推动残渣排出。附属器官分泌胆汁和消化酶参与消化。'},
 urinary:{name:'泌尿系统',description:'肾脏过滤血液，调节体液、电解质和酸碱平衡。尿液经输尿管流入膀胱，再由尿道排出。'},
 lymphatic:{name:'淋巴系统',description:'淋巴管将多余的组织液送回血液循环。淋巴结和其他淋巴器官参与免疫监视和免疫应答。'},
 endocrine:{name:'内分泌系统',description:'内分泌腺将激素释放入血液，协调代谢、生长、应激反应和生殖等过程。'},
 reproductive:{name:'生殖系统',description:'此处展示的男性生殖结构参与精子的产生、成熟与运输，以及性激素的分泌。'},
 integumentary:{name:'体表',description:'体表提供人体的外部解剖参照。皮肤系统构成保护屏障，参与感觉和体温调节。'},
 connective:{name:'结缔组织',description:'软骨、韧带等结缔组织起支撑、连接和分隔结构的作用，包括稳定关节、分散机械负荷。'},
};

export const EXPLANATIONS_ZH:Record<string,string>={
 'heart':'位于胸腔的肌肉泵。右心将血液送往肺部，左心将血液泵入体循环。',
 'liver':'位于膈肌右下方的大器官。它处理吸收的营养物质，分泌胆汁，并合成血液中的多种蛋白质。',
 'brain':'神经系统的核心器官。其相互连接的区域支持感知、运动、记忆、语言以及身体功能的调节。',
 'stomach':'位于食管与小肠之间的肌肉囊。它储存食物并使其与胃酸和消化酶充分混合，再排入十二指肠。',
 'spleen':'位于左上腹的淋巴器官。它过滤血液、清除衰老的血细胞，并参与免疫应答。',
 'pancreas':'兼具消化与内分泌功能的腹腔器官。它向小肠提供消化酶，并分泌胰岛素、胰高血糖素等激素。',
 'urinary bladder':'位于盆腔的肌肉储尿器官，储存由肾脏经输尿管送来的尿液。',
 'trachea':'连接喉与支气管的主要气道。其软骨环使气道在呼吸时保持通畅。',
 'diaphragm':'分隔胸腔与腹腔的宽大肌。收缩时扩大胸腔容积，帮助空气吸入肺部。',
};

const en={
 eyebrow:'INTERACTIVE ANATOMY',
 identityPieces:(n:number)=>`${n.toLocaleString()} modeled pieces`,
 explorerPanels:'Explorer panels',
 searchAria:'Search anatomy',
 findStructure:'Find a structure',
 aboutAria:'About this atlas',
 systems:'Systems',
 layersAria:'Anatomical layers',
 openLayersAria:'Open system layers',
 closeSystems:'Close systems',
 presetAll:'All',
 presetSkeleton:'Skeleton',
 presetOrgans:'Organs',
 showOnly:(name:string)=>`Show only ${name.toLowerCase()}`,
 showSystem:(name:string)=>`Show ${name.toLowerCase()}`,
 visiblePieces:(n:number)=>`${n.toLocaleString()} pieces visible`,
 hideAll:'Hide all',
 closeSearch:'Close search',
 searchPlaceholder:'Heart, femur, cranial nerve…',
 searchAriaInput:'Search named anatomical structures',
 noMatches:'No structures match your search.',
 resultPieces:(n:number)=>`${n} ${n===1?'piece':'pieces'}`,
 noteWithQuery:'Showing up to 80 matches. Refine your search to find smaller structures.',
 noteEmpty:'Start with a major organ, or search every named structure.',
 views:{'three-quarter':'¾ view',front:'Front view',side:'Side view',back:'Back view'} as Record<View,string>,
 cameraControls:'Camera controls',
 pauseRotation:'Pause rotation',
 rotateBody:'Rotate body',
 autoRotate:'Auto rotate',
 resetView:'Reset view and layers',
 reset:'Reset',
 captionIsolate:'SELECTED STRUCTURE',
 captionInventory:'ANATOMICAL INVENTORY',
 captionSeparated:'SEPARATED STRUCTURES',
 captionBody:'ADULT HUMAN · MALE',
 dockSystems:'Systems',
 explodeLabel:'Explode anatomy',
 assembled:'Assembled',
 everyPiece:'Every piece',
 assembleReset:'Assemble and reset',
 orbitHint:'Drag to orbit',
 panHint:'Drag to pan',
 zoomHint:'Pinch to zoom',
 tapHint:'Tap to inspect',
 sourceCredits:'Source & credits',
 loadingTitle:'Preparing the anatomy',
 loadingLine:(p:number,n:number)=>`${p}% · Loading ${n.toLocaleString()} pieces`,
 reload:'Reload viewer',
 systemFallback:'ANATOMY',
 atlasReference:'Atlas reference',
 selectedPieces:'Selected pieces',
 includedStructures:'Included structures',
 andMore:(n:number)=>`And ${n.toLocaleString()} more modeled pieces.`,
 viewSource:'View anatomical source',
 isolate:'Isolate structure',
 showSurrounding:'Show surrounding anatomy',
 clearSelection:'Clear selection',
 contextNote:'System overview · structure identified from source anatomy',
 aboutEyebrow:'SOURCE & SCOPE',
 aboutTitle:'A body, revealed.',
 aboutDescription:'Explore the adult male reference anatomy from BodyParts3D.',
 aboutMale:'Male · BodyParts3D',
 aboutScope:'2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
 aboutCaveat:'This reference does not contain every human structure or variation. Named concepts can contain multiple pieces; each source mesh is rendered once.',
 aboutNote:'Colors and system groupings are designed for exploration. The geometry is simplified for the web, and short explanations provide general educational context. This is an anatomical reference, not a diagnostic or surgical tool.',
 aboutSource:'Source',
 aboutLicense:'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.',
 linkDataset:'Dataset license',
 linkOriginal:'Original geometry & metadata',
 linkPublication:'Read the source publication',
 canvasAria:'Interactive human anatomy. Drag to orbit, pinch or scroll to zoom, and tap a structure to inspect it.',
 switchLanguage:'Switch language',
 switchTo:'中',
 errCatalogue:'The anatomy catalogue could not be loaded.',
 errWebGL:'This browser could not start the 3D viewer. Please try a browser with WebGL enabled.',
 errContext:'The 3D session was paused by your device. Reload to continue.',
 errLoad:'Could not load the anatomy.',
 errGeometry:'Could not assemble anatomy geometry.',
};

type Strings=typeof en;

const zh:Strings={
 eyebrow:'交互式人体解剖',
 identityPieces:(n:number)=>`${n.toLocaleString()} 个模型部件`,
 explorerPanels:'探索面板',
 searchAria:'搜索解剖结构',
 findStructure:'查找结构',
 aboutAria:'关于本图谱',
 systems:'系统',
 layersAria:'解剖系统分层',
 openLayersAria:'打开系统分层',
 closeSystems:'关闭系统面板',
 presetAll:'全部',
 presetSkeleton:'骨骼',
 presetOrgans:'内脏器官',
 showOnly:(name:string)=>`只显示${name}`,
 showSystem:(name:string)=>`显示${name}`,
 visiblePieces:(n:number)=>`已显示 ${n.toLocaleString()} 个部件`,
 hideAll:'全部隐藏',
 closeSearch:'关闭搜索',
 searchPlaceholder:'心脏、股骨、脑神经…',
 searchAriaInput:'搜索命名解剖结构',
 noMatches:'没有匹配的结构。',
 resultPieces:(n:number)=>`${n} 个部件`,
 noteWithQuery:'最多显示 80 条匹配结果，请细化关键词以查找更小的结构。',
 noteEmpty:'从主要器官开始，或搜索任意命名结构。',
 views:{'three-quarter':'¾ 视角',front:'正面视图',side:'侧面视图',back:'背面视图'},
 cameraControls:'视角控制',
 pauseRotation:'暂停旋转',
 rotateBody:'旋转人体',
 autoRotate:'自动旋转',
 resetView:'重置视角与分层',
 reset:'重置',
 captionIsolate:'已选结构',
 captionInventory:'解剖部件总览',
 captionSeparated:'结构分离展示',
 captionBody:'成年男性人体',
 dockSystems:'系统',
 explodeLabel:'分解视图',
 assembled:'组装状态',
 everyPiece:'逐件展开',
 assembleReset:'复位并重置',
 orbitHint:'拖动旋转',
 panHint:'拖动平移',
 zoomHint:'捏合缩放',
 tapHint:'点按查看',
 sourceCredits:'来源与致谢',
 loadingTitle:'正在准备解剖模型',
 loadingLine:(p:number,n:number)=>`${p}% · 正在加载 ${n.toLocaleString()} 个部件`,
 reload:'重新加载',
 systemFallback:'解剖',
 atlasReference:'图谱编号',
 selectedPieces:'已选部件',
 includedStructures:'包含的结构',
 andMore:(n:number)=>`另有 ${n.toLocaleString()} 个模型部件。`,
 viewSource:'查看解剖数据来源',
 isolate:'隔离显示该结构',
 showSurrounding:'显示周围解剖结构',
 clearSelection:'清除选择',
 contextNote:'系统概览 · 结构依据源解剖数据识别',
 aboutEyebrow:'来源与范围',
 aboutTitle:'人体，层层展开。',
 aboutDescription:'探索基于 BodyParts3D 的成年男性参考解剖。',
 aboutMale:'男性 · BodyParts3D',
 aboutScope:'成年男性参考解剖数据，包含 2,234 个独立网格与 3,432 个命名概念。',
 aboutCaveat:'本参考模型并不包含人体的全部结构与变异。命名概念可包含多个部件；每个源网格仅渲染一次。',
 aboutNote:'配色与系统分组为便于探索而设计。几何数据已为网页端简化，简短说明仅提供一般性教学背景。本产品是解剖学参考工具，不能用于诊断或手术。',
 aboutSource:'来源',
 aboutLicense:'BodyParts3D，© 生命科学数据库中心，采用 CC 署名 4.0 国际许可协议授权。',
 linkDataset:'数据集许可协议',
 linkOriginal:'原始几何数据与元数据',
 linkPublication:'阅读原始文献',
 canvasAria:'可交互人体解剖。拖动旋转视角，捏合或滚动缩放，点按结构查看详情。',
 switchLanguage:'切换语言',
 switchTo:'EN',
 errCatalogue:'无法加载解剖目录。',
 errWebGL:'当前浏览器无法启动 3D 查看器，请使用支持 WebGL 的浏览器。',
 errContext:'3D 会话已被设备暂停，请重新加载以继续。',
 errLoad:'无法加载解剖数据。',
 errGeometry:'无法组装解剖几何数据。',
};

export const UI:{en:Strings;zh:Strings}={en,zh};
