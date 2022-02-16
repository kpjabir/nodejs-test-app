var fortuneCookies = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you do not know.",
	"You will have a pleasent suprise.",
	"I just wato to be a good man, good man to you, girl that's all I wanna be.",
	"I wanna fold clothes for you.. I wanna make you feel good.",
];

exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
};
