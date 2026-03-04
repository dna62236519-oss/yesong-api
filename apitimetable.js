const Timetable = require('comcigan-parser-edited');
const timetable = new Timetable();

module.exports = async (req, res) => {
    // 보안을 위해 어느 사이트에서나 접근 가능하게 설정 (CORS 허용)
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        await timetable.init();
        // 예송중학교 고유 코드 직접 입력 (이미 알고 있는 코드 활용)
        const schoolCode = '7311140'; 
        await timetable.setSchool(schoolCode);

        const result = await timetable.getTimetable();
        
        // 사용자가 주소 뒤에 ?grade=1&class=1 처럼 입력한 값을 읽음
        const grade = req.query.grade || 1;
        const classNum = req.query.class || 1;

        // 결과 반환
        res.status(200).json({
            school: "예송중학교",
            grade: grade,
            class: classNum,
            data: result[grade][classNum]
        });
    } catch (error) {
        res.status(500).json({ error: "데이터를 불러오지 못했습니다.", detail: error.message });
    }
};