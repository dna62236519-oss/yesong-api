const Timetable = require('comcigan-parser-edited');
const timetable = new Timetable();

module.exports = async (req, res) => {
    // CORS 해결
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // 매 요청마다 초기화를 확인합니다.
        await timetable.init();
        await timetable.setSchool('7311140'); // 예송중 코드

        const result = await timetable.getTimetable();
        
        const grade = req.query.grade || 1;
        const classNum = req.query.class || 1;

        // 데이터가 없는 경우 처리
        if (!result[grade] || !result[grade][classNum]) {
            return res.status(404).json({ error: "해당 학년/반의 데이터를 찾을 수 없습니다." });
        }

        res.status(200).json({
            school: "예송중학교",
            data: result[grade][classNum]
        });
    } catch (error) {
        res.status(500).json({ error: "서버 내부 오류", message: error.message });
    }
};
