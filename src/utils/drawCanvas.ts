import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS, Results } from '@mediapipe/hands';

/**
 * canvas 画图工具函数
 * @param ctx canvas context
 * @param results 手的结果
 */
export const drawCanvas = (ctx: CanvasRenderingContext2D, results: Results) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    // canvas 左右翻转
    ctx.scale(-1, 1)
    ctx.translate(-width, 0)
    // 在 camera 抓取的 image 上绘制结果
    ctx.drawImage(results.image, 0, 0, width, height)
    // 手的结果绘制
    if (results.multiHandLandmarks) {
        // 骨骼绘制
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 })
            drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 })
        }
    }
    ctx.restore()
}