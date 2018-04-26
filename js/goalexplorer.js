var observe, inputSkillId = -1;
var suggestionbox = $('#suggestions');
var inputskill = $('#input-skill');
var skills = [{
    id: 0,
    skill: 'Код бичдэг болох',
    levels: [{
        id: 0, 
        level: 'Анхан түвшинд'
    },{
        id: 1, 
        level: 'Дунд түвшинд'
    },{
        id: 2, 
        level: 'Ахисан түвшинд'
    }],
    levelid: 0
}, {
    id: 1,
    skill: 'Код лаадаг болох',
    levels: [{
        id: 0, 
        level: 'Нүүб түвшинд'
    },{
        id: 1, 
        level: 'Крусейдэр түвшинд'
    },{
        id: 2, 
        level: 'Год түвшинд'
    }],
    levelid: 0
}];
var suggestedskills = [{
    id: 0,
    skill: 'Код бичдэг болох',
    levels: [{
        id: 0, 
        level: 'Анхан түвшинд'
    },{
        id: 1, 
        level: 'Дунд түвшинд'
    },{
        id: 2, 
        level: 'Ахисан түвшинд'
    }],
    levelid: 0
}, {
    id: 1,
    skill: 'Код лаадаг болох',
    levels: [{
        id: 0, 
        level: 'Нүүб түвшинд'
    },{
        id: 1, 
        level: 'Крусейдэр түвшинд'
    },{
        id: 2, 
        level: 'Год түвшинд'
    }],
    levelid: 0
}];

if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

init(); 

function init () {
    var text = $('textarea');
    function resize () {
        text.css('height', 'auto');
        text.css('height', text[0].scrollHeight+'px');
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text[0], 'change',  resize);
    observe(text[0], 'cut',     delayedResize);
    observe(text[0], 'paste',   delayedResize);
    observe(text[0], 'drop',    delayedResize);
    observe(text[0], 'keydown', delayedResize);

    text[0].focus();
    text[0].select();
    resize();


    $('body').click(function (){
        suggestionbox.removeClass('active');
    });

    inputskill.keydown(inputskillpressed);

    $('.add-skill').click(function() {
        var levelid = $('#input-skill-level').val();
        if(inputSkillId != -1 && suggestedskills.find(checkid, inputSkillId).levels.find(checkid, levelid) != undefined) {
            addSkill(inputSkillId, levelid);
        }
    });
}

function skilloptionchoosed() {
    var option = $('.option.selected');
    inputskill.val(option.html());
    inputSkillId = option.attr('skillid');
    var skill = suggestedskills.find(checkid, inputSkillId);
    var inputlevel = $('#input-skill-level');
    inputlevel.html('');
    for (var i = 0; i < skill.levels.length; i++) {
        var loption = $('<option value="' + skill.levels[i].id + '">' + skill.levels[i].level + '</option>');
        inputlevel.append(loption);
    }
    suggestionbox.removeClass('active');
}

function checkid(thing) {
    return thing.id == this;
}

function addSkill(skillid, levelid) {
    var skill = suggestedskills.find(checkid, skillid);
    skills.push(skill);
    var card = $('<div class="card" skillid="' + skillid + '" levelid="' + levelid + '"><input type="checkbox" id="check' + skillid + '" class="skill-check1"><label for="check' + skillid + '" class="skill-check2"></label>' + skill.levels.find(checkid, levelid).level + ' ' + skill.skill + '</div>'); 
    $('#input-skill-g').after(card);
}

function inputskillpressed(e) {
    suggestionbox.addClass('active');
    if(e.keyCode == 40 || e.keyCode == 9) {
        var options = $('.option');
        var option = $('.option.selected');
        var index = options.index(option);
        option.removeClass('selected');
        option = $(options.get((index + 1)%suggestedskills.length));
        option.addClass('selected');
        inputSkillId = option.attr('skillid');
        e.preventDefault();
    } else if(e.keyCode == 38) {
        var options = $('.option');
        var option = $('.option.selected');
        var index = options.index(option);
        option.removeClass('selected');
        var option = $(options.get((index + 1)%suggestedskills.length));
        console.log(index + 1);
        option.addClass('selected');
        inputSkillId = option.attr('skillid');
    } else if(e.keyCode == 13) {
        skilloptionchoosed();
        e.preventDefault();
    } else {
        suggestedskills = getSuggestions();
        placeSuggestions();
    }
}

function chooseSuggestion(option) {
    $('.option').removeClass('selected');
    option.addClass('selected');
    inputSkillId = option.attr('skillid');    
}

function placeSuggestions() {
    suggestionbox.html('');
    if(suggestedskills.length > 0) {
        var option = $('<div class="option selected" skillid="' + suggestedskills[0].id + '">' + suggestedskills[0].skill + '</div>');
        option.click(function() {
            skilloptionchoosed();
        });
        option.mouseenter(function() {
            chooseSuggestion($(this));
        });
        suggestionbox.append(option);
        inputSkillId = suggestedskills[0].id;
        inputskill.css('border-bottom-color','');
    } else {
        inputSkillId = -1;
        inputlevel.html('<option>Ямар түвшинд</option>');
        inputskill.css('border-bottom-color','red');    
    }

    for (var i = 1; i < suggestedskills.length; i++) {
        var option = $('<div class="option" skillid="' + suggestedskills[i].id + '">' + suggestedskills[i].skill + '</div>');
        option.click(function() {
            skilloptionchoosed($(this));
        });
        option.mouseenter(function() {
            chooseSuggestion($(this));
        });
        suggestionbox.append(option);
    }
}

function getSuggestions() {
    return suggestedskills;
}
