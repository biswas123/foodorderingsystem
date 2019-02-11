var newInspectionObject = {
    initialize: function () {
    	showLoading("Loading page...");
    	var link=document.createElement('link');
		link.rel="stylesheet";
		link.type="text/css";
    	if(smartflow.device.getScreenHeight()<=600){
    		screenHeight=smartflow.device.getScreenHeight();
    		var anotherlink=document.createElement('link');
    		anotherlink.rel="stylesheet";
    		anotherlink.type="text/css";
    		anotherlink.href="domain/inspectation/css/inspection_small.css";
    		$("head").append(anotherlink);
    		
    	}
    	link.href="domain/"+getLocalStorage("domainName")+"/css/domain.css";
		$("head").append(link);
		var script=document.createElement('script');
		script.type="text/javascript";
		script.src="domain/"+getLocalStorage("domainName")+"/js/domain.js";
		$("head").append(script);
        smartflow.initialize(newInspectionObject.deviceReadySuccess);
        isImagePage = true;
    },
    deviceReadySuccess: function () {
        localUserDirectory = getLocalStorage('localUserDirectory');
        
        dbPath = getLocalStorage('dbPath');
        //smartflow.device.addBackPressListener(newInspectionObject.backHandler);
        smartflow.device.setCurrentPage("InspGroupPage");
        smartflow.device.addBackPressListener(newInspectionObject.backHandler);
        window.addEventListener("resize", newInspectionObject.orientationHandler, false);
        inspectation.databaseConnect.databaseInitialize(dbPath);
        smartflow.databaseConnect.databaseInitialize(dbPath);
        functionName = "inspectionNew.js > deviceReadySuccess()";
        
        inspectionData.initializeDatasets(function() {
        	deviceReadyDeferred.resolve();
        });
        
        $(window).resize(function(){
			var newDeviceHeight = $(window).height();
			
			var pageId = $('.ui-page-active').attr('id');
	    	if(pageId == 'inspect_detail_page') {
		    	var headerHeight = $('#inspect_detail_page .headermenu').height();
				$( "#detail_content" ).css('height',smartflow.device.getScreenHeight() - (headerHeight  + 32) + 'px');
	    	} else if(pageId == 'inspect_list_page') {
	    		var headerHeight = $('#inspect_list_page .headermenu').height();
	    		$( "#inspectlist" ).css('height',smartflow.device.getScreenHeight() - (headerHeight + 22)+'px');
	    	}
	    	if(originalDeviceHeight == newDeviceHeight){
				return false;
			}
            if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA"){
               window.setTimeout(function(){
                  document.activeElement.scrollIntoViewIfNeeded();
               },0);
            }
        });
        
        loadTranslation();
        watchGPSLocation();
        showQuestionnairePopUp();
        showHideUserStatusBtn();
    },
    backHandler:{
    	handleBackClick:function() {
    		if(!isScanInProgress) {
    			newInspectionObject.backClick();
    		}
    		isScanInProgress = false;
        }
    },
    orientationHandler: function () {
    	$("html").css("overflow-x", "auto");

        resizePopup();
    },
    stopInspection: function() {
    	inspectionData.isOpenForm(function(isEditable, statusId) {
    		if(isEditable) {
	    		//check if form has mandatory/ end conclusion, and change confirmation msg
    			var data = $reqdInspections.slice(0, $reqdInspections.length);
    			$.each($reqdInspections, function(index, insp){
    				var realIndex = getArrayIndex(data, insp);
    				var inspKey = insp.inspectionId;
    				if(checkObject($linearObject)) {
    					inspKey = inspKey + "_" + $linearObject.linearObjectNum;
    				}
    				if(checkData(insp.subObjectId)) {
    					inspKey = inspKey + "_" + insp.subObjectId;
    				}
    				
    				if(checkObject(inspectionRecord.inspectionDetailMap[inspKey])) {
    					data.splice(realIndex, 1);
    				}
    			});
    			$reqdInspections = data;
    			
    			var reqCheck = inspectionRecord.inspectionDetailMap && Object.keys(inspectionRecord.inspectionDetailMap).length == 0 ? false : true;
    			
    			if($.mobile.activePage.attr("id") == "inspectie_page" && !checkData(inspectionRecord.equipmentId)) {
    				inspectionData.getRejectedFormStatus(function(rejStatusId) {
    					setLocalStorage('prevFormRecord', '');
    					if(rejStatusId == '') {
    						setLocalStorage('isLinearCopy', 'false');
    		    			setLocalStorage('lastFormId', '');
    		    			setLocalStorage('lastInspectionGroupId', '');
    		    			setLocalStorage('lastContractGroupId', '');
    		    			setLocalStorage('lastDamageId', '');
    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
    		    			setTimeout(function(){
    		    				window.location.href = getLocalStorage("redirectUrl");
    		    			},100);    		            	
    					} else {
    						saveInspectionFormData("", rejStatusId, function(){
    							setLocalStorage('isLinearCopy', 'false');
	    		    			setLocalStorage('lastFormId', '');
	    		    			setLocalStorage('lastInspectionGroupId', '');
	    		    			setLocalStorage('lastContractGroupId', '');
	    		    			setLocalStorage('lastDamageId', '');
	    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
	    		    			setTimeout(function(){
	    		    				window.location.href = getLocalStorage("redirectUrl");
	    		    			},100);
    						});
    					}
    				});
    			} else {
    				var isValid = false;
    				//checkFormValidity(function(isValid) {
        				//invalid if no insp group or equipment
    				if(checkData(inspectionRecord.inspectionGroupId) && checkData(inspectionRecord.equipmentId)) {
    					isValid = true;
    				} else {
    					isValid = false;
    				}
    				if($.mobile.activePage.attr("id") == "equipment_page" && !reqCheck) {
    					showInspFormStatusDialog(statusId, isValid, function(newStatus, statusText){
    						jsInfoLog(currentFormName + " Form saved to status:" + statusText +" from page: " + $.mobile.activePage.attr("id") , "inspectNew.js -> stopInspection");
		            		var validText = isValid ? "True" : "";
		            		saveInspectionFormData(validText, newStatus, function(){
		            			setLocalStorage('prevFormRecord', '');
		            			if(statusText == 'Completed/New') {
		            				var groupObj = {};
		            	    		groupObj["FormGroupId"] = getLocalStorage('formGroupId');
		            	    		groupObj["FormTemplateId"] = getLocalStorage('formTemplateId');
		            	    		
		            	    		mainDataObject.insertNewForm(groupObj, function(formId, formFileName ) {
		            					//handle new form creation
		            					setLocalStorage("formId", formId);
		            					setLocalStorage("formFileName", formFileName);
			            				setLocalStorage('isLinearCopy', 'false');
			            				setLocalStorage('lastFormId', currentFormId);
			            				setLocalStorage('lastInspectionGroupId', inspectionRecord.inspectionGroupId);			            				
			            				setLocalStorage('lastContractGroupId', inspectionRecord.contractGroupId);
			            				setLocalStorage('lastDamageId', inspectionRecord.damageId);
			            				setLocalStorage('isNewForm', 'true');
			            				setLocalStorage("isNewDamageForm", "false");
			            				setLocalStorage("isEsriForm", $isGISAutoOpen ? "true" : "false");
			            				setLocalStorage('prevFormRecord', JSON.stringify(inspectionRecord));
			            				jsInfoLog("Current form : " + currentFormName, "Closing form..");
			            				window.location.href = 'inspectionForm.html';
		            				});
		            			} else if(statusText.toLowerCase() == 'comp') {		            					
		            				setLocalStorage('isLinearCopy', 'false');
		    		    			setLocalStorage('lastFormId', '');
		    		    			setLocalStorage('lastInspectionGroupId', '');
		    		    			setLocalStorage('lastContractGroupId', '');
		    		    			setLocalStorage('lastDamageId', '');
		    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
		    		    			setTimeout(function(){
		    		    				window.location.href = "main.html";
		    		    			},100);
		            			}		            			
		            			else {
		            				setLocalStorage('isLinearCopy', 'false');
		    		    			setLocalStorage('lastFormId', '');
		    		    			setLocalStorage('lastInspectionGroupId', '');
		    		    			setLocalStorage('lastContractGroupId', '');
		    		    			setLocalStorage('lastDamageId', '');
		    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
		    		    			setTimeout(function(){
		    		    				window.location.href = getLocalStorage("redirectUrl");
		    		    			},100);
		            			}
		            		});
		            	});
    				} else {
        				if($reqdInspections.length > 0 || $reqdInspConds.length > 0) {
            				smartflow.dialogPanel.confirm(
            						getTranslation("and_msg_requiredNotFilled", "Vul alle verplichte inspectieregels in."), getTranslation("and_lbl_cancel", "Cancel"), getTranslation("and_lbl_ok", "Ok"),
                                            function (command) {
        								        if (command) {
    								            	isValid = !isValid || $reqdInspections.length > 0 || $reqdInspConds.length > 0 ? false : true;
    								            	showInspFormStatusDialog(statusId, isValid, function(newStatus, statusText){
    								            		jsInfoLog(currentFormName + " Form saved to status:" + statusText +" from page: " + $.mobile.activePage.attr("id") , "inspectNew.js -> stopInspection");
    								            		setLocalStorage('prevFormRecord', '');
    								            		var validText = isValid ? "True" : "";
    								            		saveInspectionFormData(validText, newStatus, function(){
    								            			if(statusText == 'Completed/New') {
    								            				var groupObj = {};
    								            	    		groupObj["FormGroupId"] = getLocalStorage('formGroupId');
    								            	    		groupObj["FormTemplateId"] = getLocalStorage('formTemplateId');
    								            	    		
    								            	    		mainDataObject.insertNewForm(groupObj, function(formId, formFileName) {
    								            					//handle new form creation
    								            					setLocalStorage("formId", formId);
    								            					setLocalStorage("formFileName", formFileName);
    									            				setLocalStorage('isLinearCopy', 'false');
    									            				setLocalStorage('lastFormId', currentFormId);
    									            				setLocalStorage('lastInspectionGroupId', inspectionRecord.inspectionGroupId);    									            				
    									            				setLocalStorage('lastContractGroupId', inspectionRecord.contractGroupId);
    									            				setLocalStorage('lastDamageId', inspectionRecord.damageId);
    									            				setLocalStorage('isNewForm', 'true');
    									            				setLocalStorage("isNewDamageForm", inspectionRecord.contractGroupId.length ? "true" : "false");
    									            				setLocalStorage("isEsriForm", $isGISAutoOpen ? "true" : "false");
    									            				setLocalStorage('prevFormRecord', JSON.stringify(inspectionRecord));
    									            				jsInfoLog("Current form : " + currentFormName, "Closing form..");
    									            				window.location.href = 'inspectionForm.html';
    								            				});
    								            			} else if(statusText.toLowerCase() == 'comp') {		            					
    								            				setLocalStorage('isLinearCopy', 'false');
    								    		    			setLocalStorage('lastFormId', '');
    								    		    			setLocalStorage('lastInspectionGroupId', '');
    								    		    			setLocalStorage('lastContractGroupId', '');
    								    		    			setLocalStorage('lastDamageId', '');
    								    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
    								    		    			setTimeout(function(){
    								    		    				window.location.href = "main.html";
    								    		    			},100);
    								            			} else {
    								            				setLocalStorage('isLinearCopy', 'false');
    								    		    			setLocalStorage('lastFormId', '');
    								    		    			setLocalStorage('lastInspectionGroupId', '');
    								    		    			setLocalStorage('lastContractGroupId', '');
    								    		    			setLocalStorage('lastDamageId', '');
    								    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
    								    		    			setTimeout(function(){
    								    		    				window.location.href = getLocalStorage("redirectUrl");
    								    		    			},100);
    								            			}
    								            		});
    								            	});
        								        }
        								    }, fileHandlingFailCallback);
            			} else {
            				showInspFormStatusDialog(statusId, isValid, function(newStatus, statusText){
            					jsInfoLog(currentFormName + " Form saved to status:" + statusText +" from page: " + $.mobile.activePage.attr("id") , "inspectNew.js -> stopInspection");
            					setLocalStorage('prevFormRecord', '');
			            		var validText = isValid ? "True" : "";
			            		saveInspectionFormData(validText, newStatus, function(){
			            			if(statusText == 'Completed/New') {
			            				var groupObj = {};
			            	    		groupObj["FormGroupId"] = getLocalStorage('formGroupId');
			            	    		groupObj["FormTemplateId"] = getLocalStorage('formTemplateId');
			            				mainDataObject.insertNewForm(groupObj, function(formId, formFileName) {
			            					//handle new form creation
			            					setLocalStorage("formId", formId);
			            					setLocalStorage("formFileName", formFileName);
				            				setLocalStorage('isLinearCopy', 'false');
				            				setLocalStorage('lastFormId', currentFormId);
				            				setLocalStorage('lastInspectionGroupId', inspectionRecord.inspectionGroupId);				            				
				            				setLocalStorage('lastContractGroupId', inspectionRecord.contractGroupId);
				            				setLocalStorage('lastDamageId', inspectionRecord.damageId);
				            				setLocalStorage('isNewForm', 'true');
				            				setLocalStorage("isNewDamageForm", inspectionRecord.contractGroupId.length ? "true" : "false");
				            				setLocalStorage("isEsriForm", $isGISAutoOpen ? "true" : "false");
				            				setLocalStorage('prevFormRecord', JSON.stringify(inspectionRecord));
				            				jsInfoLog("Current form : " + currentFormName, "Closing form..");
				            				window.location.href = 'inspectionForm.html';
			            				});
			            				
			            			} else if(statusText.toLowerCase() == 'comp') {		            					
			            				setLocalStorage('isLinearCopy', 'false');
			    		    			setLocalStorage('lastFormId', '');
			    		    			setLocalStorage('lastInspectionGroupId', '');
			    		    			setLocalStorage('lastContractGroupId', '');
			    		    			setLocalStorage('lastDamageId', '');
			    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
			    		    			setTimeout(function(){
			    		    				window.location.href = "main.html";
			    		    			},100);
			            			} else {
			            				setLocalStorage('isLinearCopy', 'false');
			    		    			setLocalStorage('lastFormId', '');
			    		    			setLocalStorage('lastInspectionGroupId', '');
			    		    			setLocalStorage('lastContractGroupId', '');
			    		    			setLocalStorage('lastDamageId', '');
			    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
			    		    			setTimeout(function(){
			    		    				window.location.href = getLocalStorage("redirectUrl");
			    		    			},100);
			            			}
			            		});
			            	});
            			} 
            			
            			/*else {
            				smartflow.dialogPanel.confirm(getTranslation("and_msg_formInvalidAlert", "Het invullen van de eindconclusie is verplicht. U kunt op de knop in de balk drukken om rechtstreeks naar het eindconclusie scherm te gaan. Druk op 'ja' om terug te gaan naar de inspectie, druk op 'nee' om de inspectie te verlaten."), getTranslation("and_lbl_no", "No"), getTranslation("and_lbl_yes", "Yes"), function(command) {
            			    	if (command) {
        			            	showInspFormStatusDialog(statusId, isValid, function(newStatus, statusText){
        			            		jsInfoLog(currentFormName + " Form saved to status:" + statusText +" from page: " + $.mobile.activePage.attr("id") , "inspectNew.js -> stopInspection");
        			            		setLocalStorage('prevFormRecord', '');
					            		var validText = isValid ? "True" : "";
					            		saveInspectionFormData(validText, newStatus, function(){
				            				setLocalStorage('isLinearCopy', 'false');
				    		    			setLocalStorage('lastFormId', '');
				    		    			setLocalStorage('lastInspectionGroupId', '');
				    		    			setLocalStorage('lastContractGroupId', '');
				    		    			setLocalStorage('lastDamageId', '');
				    		    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
				    		            	window.location.href = getLocalStorage("redirectUrl");
					            		});
					            	});
            			        }
            			    });
            			}*/
        			}
        			//});
    			}
	        	
    		} else {
    			if(statusId != '') {
	    			jsInfoLog(currentFormName + " Form is not editable...closing form", "function -> stopInspection()");
	    			setLocalStorage('isLinearCopy', 'false');
	    			setLocalStorage('lastFormId', '');
	    			setLocalStorage('lastInspectionGroupId', '');
	    			setLocalStorage('lastContractGroupId', '');
	    			jsInfoLog("Current form : " + currentFormName, "Closing form..");
	    			setTimeout(function(){
	    				window.location.href = getLocalStorage("redirectUrl");
	    			},100);
    			}
    		}
    	});
    },
    openHelp: function() {
        openHelp();
    },
    openRFID : function(currentPage, isDamageReading, dataset, displayAttr, queryAttr, callBack) {
    	inspectation.RFIDHandler.handleRFIDControls(currentPage, isDamageReading, dataset, displayAttr, queryAttr, callBack);
    },
    openQR : function(callBack) {
    	inspectation.barcode.scan.openScanner(callBack);
    },
    handleBluetoothGps : function(btnSource,callback){
    	inspectation.BluetoothGpsHandler.handleBluetoothGps(btnSource,callback);
    },
    openEsri : function(activity, callback, errorCallBack) {    	
    	inspectionData.getEsriSettings(function(esriSetting){
    		if(esriSetting != null) {
    		//call Esri plugin with params - groupId, url, esri settings, activity, callBack
    			inspectation.esriHandler.handleEsriMapControl(esriSetting, activity, '', callback, function(errCode) {
					$('#loading-mask').css('display', 'none');
					if(errCode == 'ClearForm') {
						hideLoading();
    					inspectionRecord.resetAllSettings();
    					inspectionRecord.inspectionGroupId = "";
    					setLocalStorage('lastInspectionGroupId', '');
		    			setLocalStorage('lastContractGroupId', '');
    					$inspectStack = null;
    					
    					$.mobile.changePage("#inspectie_page", {
    						transition : "none"
						});
    					return;
    				}
    				if(activity == 'CheckEsriActivity' && errCode == 'and_msg_noEsriInstall') {
    					callback('-1');
    					return;
    				}
    				toolTipMessage(getTranslation(errCode, 'Geen object gekozen'));
    				if(errorCallBack){
    					errorCallBack();
    				}
    			});
    		} else {
    			$('#loading-mask').css('display', 'none');
    			toolTipMessage(getTranslation('and_msg_invalidEsriSetting', 'Invalid setting for Esri'));
    			if(errorCallBack){
					errorCallBack();
				}
    		}
    	});
    },
    autoOpenEsri : function(activity, selectionType, callback, errorCallBack) {
    	inspectionData.getEsriSettings(function(esriSetting){
    		if(esriSetting != null) {
    		//call Esri plugin with params - groupId, url, esri settings, activity, callBack
    			inspectation.esriHandler.handleEsriMapControl(esriSetting, activity, selectionType, callback, function(errCode) {
    				$('#loading-mask').css('display', 'none');
    				if(errCode == 'ClearForm') {
    					hideLoading();
    					inspectionRecord.resetAllSettings();
    					inspectionRecord.inspectionGroupId = "";
    					setLocalStorage('lastInspectionGroupId', '');
		    			setLocalStorage('lastContractGroupId', '');
    					$inspectStack = null;
    					
    					if(selectionType == 'linear' || (checkData($lastFormId) && selectionType == 'object')) {
						    $.mobile.changePage("#inspectie_page", {
						    	transition : "none"
						    });
    					}
    					return;
    				}    				
    				if(selectionType == 'object' && errCode) {    					
    					callback('-1');
    				} else {
    					hideLoading();
    					toolTipMessage(getTranslation(errCode, 'Problem in retrieving data from Esri'));
    				}
    				if(errorCallBack){
    					errorCallBack();
    				}
    			});
    		} else {
    			hideLoading();
				$('#loading-mask').css('display', 'none');
    			toolTipMessage(getTranslation('and_msg_invalidEsriSetting', 'Invalid setting for Esri'));
    			if(errorCallBack){
					errorCallBack();
				}
    		}
    	});
    },
    checkEsriActivity : function(activity, callback, errorCallBack) {
    	inspectionData.getEsriSettings(function(esriSetting){
    		if(esriSetting != null) {
    			//call Esri plugin with params - groupId, url, esri settings, activity, callBack
    			inspectation.esriHandler.handleEsriMapControl(esriSetting, activity, callback, function(errCode) {
    				callback('-1');
    			});
    		} else {
    			callback('-1');
    		}
    	});
    },
    downloadEsriCache : function(esriSetting, callback, callbackErr){
    	if(esriSetting != null) {
    		inspectation.esriHandler.handleEsriCacheDownload(esriSetting, callback, callbackErr);
    	} else {
    		toolTipMessage(getTranslation('and_msg_invalidEsriSetting', 'Invalid setting for Esri'));
    	}
    },
    showGoldSchmidt : function(inspectId, type, callback, callbackErr) {
    	inspectation.goldSchmidtHandler.handleGoldSchmidtControl(inspectId, type, callback, callbackErr);
    },
    backClick: function () {
        var activePage = $('.ui-page-active').attr('id');
        if($("#" + activePage + " .prev").is(':hidden')) {
        	newInspectionObject.stopInspection();
        } else {
        	$("#" + activePage + " .prev").trigger('click');
        }
        
    },
    showObjectInfo: function() {
    	inspectionData.getEquipmentInfo(inspectionRecord.equipmentId, function(result) {
    		result = JSON.parse(result);
    		if(result.length > 0) {
    			alert(result[0].EquipmentInfo);
    		}
    	});
    },
    startGPSTracking: function() {
		useBackgroundGPS = false;    	
    	var userId = getLocalStorage("userId");
    	functionName = "inspectionNew.js > startGPSTracking()";
    	jsInfoLog("GPS Tracking started", functionName);
    	var isTrimbleTracking = false;
    	if($isTrimble){
    		inspectionData.getTrimbleTrackingInterval(function(interval) {
    			if(interval > 0) {
    				isTrimbleTracking = true;
    				newInspectionObject.handleBluetoothGps("Tracking",function(data){
    	    			if(data == 'false') {
    	    				jsDebugLog("Inaccurate GPS","inspectionNew.js > startGPSTracking()");
    	    			} else {
    		    			var resultData = unescape(data).replace(/\+/g, ' ');
    		    		    var resultJson = $.parseJSON(String(resultData));
    		    		    
    		    		    if (resultJson == null || resultJson == '' || resultJson == undefined) {
    		    		    	
    		    		    } else {
    		    		    	if(userId != 0 && userId != "" && userId != undefined && userId != null){
    			    		    	var dateTime = getCurrentDateTime();
    			    		        var lat = resultJson.CurrentLat;
    			    		        var lon = resultJson.CurrentLong;
    			    				
    			    			    smartflow.databaseConnect.executeNonQuery("INSERT INTO UserCoordinates VALUES (NULL, '" + userId + "', '" + dateTime + "', '" + lat + "', '" + lon + "', '" + currentFormName + "')", function () {
    			    			    	jsDebugLog("Trimble GPS record inserted: " + lat + "," + lon + "->" + currentFormName, functionName);
    			    			    	if($('#gpsPopup').is(':visible')) {
    	    	    			    		var strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
    	    	    		            	var dateCreated = getDate(dateTime) + " " + getTime(dateTime);
    	    	    		            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
    	    	    			    	}
    			    			    }, function (err) {
    			    			        jsErrorLog(err,functionName +" While inserting into UserCoordinates");
    			    			    });
    		    		    	}
    		    		    }
    	    			}
    	    		    
    	    		},function(data){
    	    			jsDebugLog("Inaccurate GPS",functionName);
    	    		});
    				
    				$gpsTimer = setTimeout(function(){
    		    		if(!useBackgroundGPS) {
    		    			newInspectionObject.startGPSTracking();
    		    		}
    		    	}, interval * 1000);
    			} else {
    				var highAccuracy = true;
    	        	if($trackingInterval >= 60 && (navigator.connection.type == Connection.WIFI || navigator.connection.type == Connection.ETHERNET
    	        			|| navigator.connection.type == Connection.CELL || navigator.connection.type == Connection.CELL_2G 
    	        			|| navigator.connection.type == Connection.CELL_3G || navigator.connection.type == Connection.CELL_4G)){
    	        		highAccuracy = false;
    	        	}
    	        	
    	        	smartflow.geolocation.getCurrentPosition(function(position){
    	        		if(userId != 0 && userId != "" && userId != undefined && userId != null){
    	        			var dateTime = getCurrentDateTime();
    	        			var currentLatitude = position.coords.latitude;
    	        			var currentLongitude = position.coords.longitude;
    	    			    smartflow.databaseConnect.executeNonQuery("INSERT INTO UserCoordinates VALUES (NULL, '" + userId + "', '" + dateTime + "', '" + currentLatitude + "', '" + currentLongitude + "', '" + currentFormName + "')", function () {    	    			    	
    	    			    	jsDebugLog("GPS record inserted: " + lat + "," + lon + "->" + currentFormName, functionName);
    	    			    	if($('#gpsPopup').is(':visible')) {
    	    			    		var strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
    	    		            	var dateCreated = getDate(dateTime) + " " + getTime(dateTime);
    	    		            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
    	    			    	}
    	    			    }, function (err) {
    	    			        jsErrorLog(err,functionName +" While inserting into UserCoordinates");
    	    			    });
    	        		}
    	        	}, function(e){
    	        		smartflow.geolocation.getCurrentPosition(function(position) {
    	        			if(userId != 0 && userId != "" && userId != undefined && userId != null){
    	            			var dateTime = getCurrentDateTime();
    	            			var currentLatitude = position.coords.latitude;
    	            			var currentLongitude = position.coords.longitude;
    	        			    smartflow.databaseConnect.executeNonQuery("INSERT INTO UserCoordinates VALUES (NULL, '" + userId + "', '" + dateTime + "', '" + currentLatitude + "', '" + currentLongitude + "', '" + currentFormName + "')", function () {
    	        			    	jsDebugLog("GPS record inserted: " + lat + "," + lon + "->" + currentFormName, functionName);
    	        			    	if($('#gpsPopup').is(':visible')) {
        	    			    		var strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
        	    		            	var dateCreated = getDate(dateTime) + " " + getTime(dateTime);
        	    		            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
        	    			    	}
    	        			    }, function (err) {
    	        			        jsErrorLog(err,functionName +" While inserting into UserCoordinates");
    	        			    });
    	            		}
    	        		}, function(e){
    	            	}, { timeout: 10000, enableHighAccuracy: highAccuracy, maximumAge: 300000 });
    	        	}, { timeout: 10000, enableHighAccuracy: highAccuracy });
    	        	
    	        	$gpsTimer = setTimeout(function(){
    	        		if(!useBackgroundGPS) {
    	        			newInspectionObject.startGPSTracking();
    	        		}
    	        	}, $trackingInterval * 1000);
    			}
    		});    		
    	} else {
    		var highAccuracy = true;    		
        	if($trackingInterval >= 60 && (navigator.connection.type == Connection.WIFI || navigator.connection.type == Connection.ETHERNET
        			|| navigator.connection.type == Connection.CELL || navigator.connection.type == Connection.CELL_2G 
        			|| navigator.connection.type == Connection.CELL_3G || navigator.connection.type == Connection.CELL_4G)){
        		highAccuracy = false;
        	}
        	
        	smartflow.geolocation.getCurrentPosition(function(position){
        		if(userId != 0 && userId != "" && userId != undefined && userId != null){
        			var dateTime = getCurrentDateTime();
        			var currentLatitude = position.coords.latitude;
        			var currentLongitude = position.coords.longitude;
    			    smartflow.databaseConnect.executeNonQuery("INSERT INTO UserCoordinates VALUES (NULL, '" + userId + "', '" + dateTime + "', '" + currentLatitude + "', '" + currentLongitude + "', '" + currentFormName + "')", function () {
    			    	jsDebugLog("GPS record inserted: " + currentLatitude + "," + currentLongitude + "->" + currentFormName, functionName);
    			    	if($('#gpsPopup').is(':visible')) {
    			    		var strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
    		            	var dateCreated = getDate(dateTime) + " " + getTime(dateTime);
    		            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
    			    	}
    			    }, function (err) {
    			        jsErrorLog(err,functionName +" While inserting into UserCoordinates");
    			    });
        		}
        	}, function(e){
        		smartflow.geolocation.getCurrentPosition(function(position) {
        			if(userId != 0 && userId != "" && userId != undefined && userId != null){
            			var dateTime = getCurrentDateTime();
            			var currentLatitude = position.coords.latitude;
            			var currentLongitude = position.coords.longitude;
        			    smartflow.databaseConnect.executeNonQuery("INSERT INTO UserCoordinates VALUES (NULL, '" + userId + "', '" + dateTime + "', '" + currentLatitude + "', '" + currentLongitude + "', '" + currentFormName + "')", function () {
        			    	jsDebugLog("GPS record inserted: " + currentLatitude + "," + currentLongitude + "->" + currentFormName, functionName);
        			    	if($('#gpsPopup').is(':visible')) {
	    			    		var strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
	    		            	var dateCreated = getDate(dateTime) + " " + getTime(dateTime);
	    		            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
	    			    	}
        			    }, function (err) {
        			        jsErrorLog(err,functionName +" While inserting into UserCoordinates");
        			    });
            		}
        		}, function(e){
            	}, { timeout: 10000, enableHighAccuracy: highAccuracy, maximumAge: 300000 });
        	}, { timeout: 10000, enableHighAccuracy: highAccuracy });
        	
        	$gpsTimer = setTimeout(function(){
        		if(!useBackgroundGPS) {
        			newInspectionObject.startGPSTracking();
        		}
        	}, $trackingInterval * 1000);
    	}
    },
    stopGPSTracking: function() {
    	jsInfoLog("GPS tracking stop", "function -> stopGPSTracking()");
    	if($gpsTimer) {
    		clearTimeout($gpsTimer);
    	}
    	watchGPSLocation();
    	if(!$isTrackingDefault) {
        	var pageId = $('.ui-page-active').attr('id');
	    	if(pageId == 'inspect_list_page') {
	    		$('#list_titleGPSTrack').show();
	    		$('#list_titleGPSPause').hide();
	    	} else if(pageId == 'sub_object_page') {
	    		$('#obj_titleGPSTrack').show();
	    		$('#obj_titleGPSPause').hide();
	    	}
    	}
    },
    showLastGPSRecord: function() {
    	if(gpsStartTime == '') {
    		gpsStartTime = new Date();
    	}
    	inspectionData.getLastGPSData(function(dateCreated){
            $("#gpsPopup #popupHeader").html(getTranslation("and_lbl_titleGPSInfo", "GPS tracking actief"));
            var strHtml = "";
            if(dateCreated != "") {
            	gpsStartTime = '';
            	strHtml = getTranslation("and_msg_lastGPSInfo", "Laatste GPS locatie gestuurd om:")
            	dateCreated = getDate(dateCreated) + " " + getTime(dateCreated);
            	$("#gpsPopup .popupContent").html(strHtml + "<br/><br/>" + dateCreated);
            } else {
            	showLoading(getTranslation('ang_msg_recordGPS', 'Retrieving GPS data...'));
            	var now = new Date();
            	if((now - gpsStartTime) > 60000) {
            		hideLoading();
            		alert(getTranslation("and_msg_noGPSData", "GPS not found"));
            		gpsStartTime = '';
            		if(gpsRecordTimer) {
            			clearTimeout(gpsRecordTimer);
            		}
            		if(!$isTrackingDefault) {
                    	var pageId = $('.ui-page-active').attr('id');
            	    	if(pageId == 'inspect_list_page') {
            	    		$('#list_titleGPSTrack').show();
            	    		$('#list_titleGPSPause').hide();
            	    	} else if(pageId == 'sub_object_page') {
            	    		$('#obj_titleGPSTrack').show();
            	    		$('#obj_titleGPSPause').hide();
            	    	}
                	}
            	} else {
	            	gpsRecordTimer = setTimeout(function(){
	            		newInspectionObject.showLastGPSRecord();
	            	}, 10000);
            	}
            	return;
            }
            hideLoading();
            $("#gpsPopup .popupContent").trigger("create");
            var height = $(window).height() - 400 + "px";
            $("#gpsPopup .popupContent").css("height", height);
            //if(buttonName == 'Start') {
            
            if($isTrackingDefault) {
            	$('#closePopup').show();
            	$('#closePopup .ui-btn-text').text(getTranslation('and_lbl_ok', 'OK'));
            	$("#closePopup").attr('onclick', '$("#gpsPopup.popupDialog").popup();$("#gpsPopup.popupDialog").popup("close");$("#gpsPopup.popupDialog").hide();');
            } else {
            	$('#closePopup').show();
            	$('#closePopup .ui-btn-text').text(getTranslation('and_lbl_gpsStop', 'Stop'));
            	$("#closePopup").attr('onclick', 'newInspectionObject.stopGPSTracking();$("#gpsPopup.popupDialog").popup();$("#gpsPopup.popupDialog").popup("close");$("#gpsPopup.popupDialog").hide();');
            }
            //} else {
            //	$("#closePopup").attr('onclick', 'newInspectionObject.startGPSTracking();$(".popupDialog").popup("close");$(".popupDialog").hide();');
            //}
            
            $('#gpsPopup').show();
            $('#gpsPopup').popup();
            $('#gpsPopup').popup('open');
            resizePopup();
            hideLoading();
        });
    }
};