var autoComplete = (function() {
    function autoComplete(options) {
        // Functions in order to make the code more clear
        function hasClass(element, className) {
            return element.classList.contains(className);
        }
        function addEvent(element, event, eventFunction) {
            element.addEventListener(event, eventFunction);
        }
        function removeEvent(element, event, eventFunction) {
            element.removeEventListener(event, eventFunction);
        }
        function addLiveEvent(targetClassName, event, eventFunction, element) {
            addEvent(element, event, function(e){
                var targetElement = e.target,
                    found;
                
                while(targetElement && !(found = hasClass(targetElement, targetClassName))) {
                    targetElement = targetElement.parrentElement;
                }
                if (found) {
                    eventFunction(targetElement);
                    return;
                }  
            });
        }
        // Autocomplete Setups 
        var autoCompleteSetups = {
            inputSelector : '',
            data : '',
            maxItemsBox : 5,
            findSuggestions : function(currentValue, dataList) {
                var suggestionsList = [];
                currentValue = currentValue.toLowerCase();
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].toLowerCase().indexOf(currentValue) > -1) {
                        suggestionsList.push(dataList[i]);
                    }
                }
                return suggestionsList;
            },
            itemRender : function(dataItem, currentValue) {
                var html = '',
                    re = new RegExp('(' + currentValue + ')','gi');
                html += '<div class="suggestions-box-item" data-item="';
                html += dataItem;
                html += '">';
                html += dataItem.replace(re,'<b>$1</b>');
                html += '</div>';
                return html;
            }
        }
        
        // Setups initialization. 
        for (var key in options) {
            if (autoCompleteSetups.hasOwnProperty(key)) {
                autoCompleteSetups[key] = options[key];
            }
        }
        
        // Defining input field and creating suggestions box.
        var inputField = document.querySelector(autoCompleteSetups.inputSelector);
        inputField.suggestionsBox = document.createElement('DIV');
        inputField.suggestionsBox.className = 'suggestions-box';
        inputField.lastValue = '';

        
        // Upgrading suggestions box inner html code
        inputField.suggestionsBox.refreshInnerContent = function(suggestionsData, currentValue) {
            var html = '';
            for (var i = 0; i < suggestionsData.length; i++) {
                html +=autoCompleteSetups.itemRender(suggestionsData[i],currentValue);   
            }
           
            this.innerHTML = html;
            
        };
        // Rendering suggestions box
        inputField.suggestionsBox.refresh = function(newSuggestions, currentValue) {
            var inputRect = inputField.getBoundingClientRect();
            this.style.width = inputRect.width + 'px';
            this.style.top = inputRect.bottom + window.pageYOffset + 'px';
            this.style.left = inputRect.left + 'px';

            this.scrollTop = 0;
            this.refreshInnerContent(newSuggestions, currentValue);
            
            document.body.appendChild(this);
            
            if (this.firstElementChild && !this.itemHeight) {
                this.itemHeight = this.firstElementChild.getBoundingClientRect().bottom - inputRect.bottom;
            }
            
            if (this.itemHeight) {
                this.maxHeight = this.itemHeight*autoCompleteSetups.maxItemsBox;
                this.style.maxHeight = this.maxHeight + 'px';
            }
            
            this.style.display = 'block';
        };
       
        // keydown event Handler for the input
        inputField.keyDownHandler = function(event) {
            
            var keyCode = event.which || event.keyCode,
                curSelectedItem = inputField.suggestionsBox.querySelector('.selected');
            if (curSelectedItem && keyCode === 13) {
                event.preventDefault();
                this.value = curSelectedItem.getAttribute('data-item');
                this.suggestionsBox.style.display = 'none';
                return;
            } 
        }
        // keyup event Handler for the input
        inputField.keyUpHandler = function(event) {
            var keyCode = event.which || event.keyCode,
                value = this.value,
                curSelectedItem = inputField.suggestionsBox.querySelector('.selected');
            
            if (keyCode === 13) {
                return;
            }
            
            if (value === '') {
                this.suggestionsBox.style.display = 'none';
                this.lastValue = '';
                return;
            }
        
            if (keyCode !== 38 && keyCode !== 40) {
                if (this.lastValue !== value) {
                    this.suggestionsBox.refresh(autoCompleteSetups.findSuggestions(value, autoCompleteSetups.data), value);
                    this.lastValue = value;
                }   
            } else if (!curSelectedItem) {
                    this.suggestionsBox.firstElementChild.className += ' selected';
                } else {
                    curSelectedItem.classList.remove('selected');
                    
                    
                   if (keyCode === 38) {
                       if (!(curSelectedItem = curSelectedItem.previousElementSibling)) {
                           curSelectedItem = this.suggestionsBox.lastElementChild;
                       } 
                       curSelectedItem.className +=' selected';
                       
                       var l = curSelectedItem.getBoundingClientRect().top-this.suggestionsBox.getBoundingClientRect().top;
                       if (l >= this.suggestionsBox.maxHeight) {
                           this.suggestionsBox.scrollTop = curSelectedItem.getBoundingClientRect().top-this.suggestionsBox.getBoundingClientRect().top - this.suggestionsBox.maxHeight + this.suggestionsBox.itemHeight;
                       } 

                       if (l < 0) {
                           this.suggestionsBox.scrollTop -=this.suggestionsBox.itemHeight;
                       }
           
                   } else {
                       if (!(curSelectedItem = curSelectedItem.nextElementSibling)) {
                           curSelectedItem = this.suggestionsBox.firstElementChild;
                           this.suggestionsBox.scrollTop = 0;
                       } 
                       curSelectedItem.className +=' selected';
                       var l = curSelectedItem.getBoundingClientRect().top-this.suggestionsBox.getBoundingClientRect().top;
                       if (l >= this.suggestionsBox.maxHeight) {
                           this.suggestionsBox.scrollTop += this.suggestionsBox.itemHeight;
                       }
                   }
                    
            }
                
        }
        // Blur event handler for the input
        inputField.blurHandler = function() {
            this.suggestionsBox.style.display = 'none';   
        }
        // Blur Input Event
        addEvent(inputField,'blur',inputField.blurHandler);
        // Key Up Event on Keyboard
        addEvent(inputField,'keyup',inputField.keyUpHandler);
        // Key Down Event on Keyboard
        addEvent(inputField,'keydown',inputField.keyDownHandler);
        // Mouse Over Event 
        addLiveEvent('suggestions-box-item', 'mouseover', function(e) {
            var prevSelected = document.querySelector('.suggestions-box-item.selected');
            if(prevSelected) {
                prevSelected.classList.remove('selected');
            }
            e.className += ' selected';
        }, inputField.suggestionsBox);
        
        // Mouse Down Event 
        addLiveEvent('suggestions-box-item','mousedown', function(e) {
            inputField.value = e.getAttribute('data-item');
            inputField.suggestionsBox.style.display = 'none';
        },inputField.suggestionsBox);
         
    }
    return autoComplete;
})();