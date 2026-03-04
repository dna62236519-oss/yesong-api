const Timetable = require('comcigan-parser-edited');
const timetable = new Timetable();

module.exports = async (req, res) => {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // 1. 초기화 및 학교 설정 (재시도 로직 포함)
        let isInitialized = false;
        for (let i = 0; i < 3; i++) {
            try {
                await timetable.init();
                // 예송중학교를 이름으로 다시 검색해서 정확한 내부 코드를 가져옵니다.
                const school = await timetable.searchSchool('예송중');
                if (school && school.length > 0) {
                    await timetable.setSchool(school[0].scCode);
                    isInitialized = true;
                    break;
                }
            } catch (e) {
                console.log(`접속 시도 ${i + 1}회 실패...`);
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기 후 재시도
            }
        }

        if (!isInitialized) {
            throw new Error("컴시간 서버 접속에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }

        // 2. 전체 시간표 가져오기
        const result = await timetable.getTimetable();
        
        const grade = req.query.grade || 1;
        const classNum = req.query.class || 1;

        // 3. 데이터 반환
        if (result[grade] && result[grade][classNum]) {
            res.status(200).json({
                school: "예송중학교",
                grade: grade,
                class: classNum,
                data: result[grade][classNum]
            });
        } else {
            res.status(404).json({ error: "해당 반의 시간표가 없습니다." });
        }

    } catch (error) {
        res.status(500).json({ 
            error: "서버 내부 오류", 
            message: error.message 
        });
    }
};
