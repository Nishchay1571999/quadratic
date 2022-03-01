var Module=typeof globalThis.__pyodide_module!=="undefined"?globalThis.__pyodide_module:{};if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH="";if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof process==="undefined"&&typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}var PACKAGE_NAME="joblib.data";var REMOTE_PACKAGE_BASE="joblib.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"];var PACKAGE_UUID=metadata["package_uuid"];function fetchRemotePackage(packageName,packageSize,callback,errback){if(typeof process==="object"){require("fs").readFile(packageName,(function(err,contents){if(err){errback(err)}else{callback(contents.buffer)}}));return}var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,(function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}}),handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","lib",true,true);Module["FS_createPath"]("/lib","python3.9",true,true);Module["FS_createPath"]("/lib/python3.9","site-packages",true,true);Module["FS_createPath"]("/lib/python3.9/site-packages","joblib",true,true);Module["FS_createPath"]("/lib/python3.9/site-packages","joblib-0.11-py3.9.egg-info",true,true);function processPackageData(arrayBuffer){assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);var curr;var compressedData={data:null,cachedOffset:146671,cachedIndexes:[-1,-1],cachedChunks:[null,null],offsets:[0,1335,2596,3896,5042,6314,7420,8746,10003,11510,12728,14030,15353,16395,17660,18768,19716,20898,21915,22961,23856,25087,26493,27965,29235,30516,31778,33089,34567,35630,36682,38180,39360,40484,41850,42902,43979,45169,46473,47486,48677,49893,51156,52213,53346,54569,55699,56929,58051,59097,60399,61608,62747,63769,65034,66288,67559,68919,70017,71045,72484,73827,75176,76464,77716,79121,80376,81702,83069,84321,85734,87064,88432,89761,90966,92229,93597,95006,96241,97421,98657,100152,101362,102600,104019,105469,106841,107936,109067,110109,111301,112510,113787,114951,116029,117177,118582,119984,121306,122297,123655,124929,126273,127797,129257,130602,131785,133196,134479,135720,136902,138139,139561,140728,141861,143371,144822,145520,146105,146492],sizes:[1335,1261,1300,1146,1272,1106,1326,1257,1507,1218,1302,1323,1042,1265,1108,948,1182,1017,1046,895,1231,1406,1472,1270,1281,1262,1311,1478,1063,1052,1498,1180,1124,1366,1052,1077,1190,1304,1013,1191,1216,1263,1057,1133,1223,1130,1230,1122,1046,1302,1209,1139,1022,1265,1254,1271,1360,1098,1028,1439,1343,1349,1288,1252,1405,1255,1326,1367,1252,1413,1330,1368,1329,1205,1263,1368,1409,1235,1180,1236,1495,1210,1238,1419,1450,1372,1095,1131,1042,1192,1209,1277,1164,1078,1148,1405,1402,1322,991,1358,1274,1344,1524,1460,1345,1183,1411,1283,1241,1182,1237,1422,1167,1133,1510,1451,698,585,387,179],successes:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};compressedData["data"]=byteArray;assert(typeof Module.LZ4==="object","LZ4 not present - was your app build with  -s LZ4=1  ?");Module.LZ4.loadPackage({metadata:metadata,compressedData:compressedData},true);Module["removeRunDependency"]("datafile_joblib.data")}Module["addRunDependency"]("datafile_joblib.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({files:[{filename:"/lib/python3.9/site-packages/joblib/func_inspect.py",start:0,end:13254,audio:0},{filename:"/lib/python3.9/site-packages/joblib/backports.py",start:13254,end:15859,audio:0},{filename:"/lib/python3.9/site-packages/joblib/disk.py",start:15859,end:19094,audio:0},{filename:"/lib/python3.9/site-packages/joblib/testing.py",start:19094,end:21212,audio:0},{filename:"/lib/python3.9/site-packages/joblib/_multiprocessing_helpers.py",start:21212,end:22391,audio:0},{filename:"/lib/python3.9/site-packages/joblib/numpy_pickle_utils.py",start:22391,end:45905,audio:0},{filename:"/lib/python3.9/site-packages/joblib/hashing.py",start:45905,end:56068,audio:0},{filename:"/lib/python3.9/site-packages/joblib/_compat.py",start:56068,end:56497,audio:0},{filename:"/lib/python3.9/site-packages/joblib/logger.py",start:56497,end:61635,audio:0},{filename:"/lib/python3.9/site-packages/joblib/memory.py",start:61635,end:100944,audio:0},{filename:"/lib/python3.9/site-packages/joblib/numpy_pickle.py",start:100944,end:124181,audio:0},{filename:"/lib/python3.9/site-packages/joblib/numpy_pickle_compat.py",start:124181,end:132620,audio:0},{filename:"/lib/python3.9/site-packages/joblib/my_exceptions.py",start:132620,end:136463,audio:0},{filename:"/lib/python3.9/site-packages/joblib/pool.py",start:136463,end:161610,audio:0},{filename:"/lib/python3.9/site-packages/joblib/parallel.py",start:161610,end:194690,audio:0},{filename:"/lib/python3.9/site-packages/joblib/_parallel_backends.py",start:194690,end:209103,audio:0},{filename:"/lib/python3.9/site-packages/joblib/__init__.py",start:209103,end:214154,audio:0},{filename:"/lib/python3.9/site-packages/joblib/format_stack.py",start:214154,end:228793,audio:0},{filename:"/lib/python3.9/site-packages/joblib/_memory_helpers.py",start:228793,end:232399,audio:0},{filename:"/lib/python3.9/site-packages/joblib-0.11-py3.9.egg-info/PKG-INFO",start:232399,end:237424,audio:0},{filename:"/lib/python3.9/site-packages/joblib-0.11-py3.9.egg-info/dependency_links.txt",start:237424,end:237425,audio:0},{filename:"/lib/python3.9/site-packages/joblib-0.11-py3.9.egg-info/top_level.txt",start:237425,end:237432,audio:0},{filename:"/lib/python3.9/site-packages/joblib-0.11-py3.9.egg-info/SOURCES.txt",start:237432,end:244488,audio:0}],remote_package_size:150767,package_uuid:"6b5c042a-8876-47da-80ee-ff0122c5c728"})})();