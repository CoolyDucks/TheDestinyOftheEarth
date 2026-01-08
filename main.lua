local Player = require("graphics.engine.starwolf.script.player")
local Enemy = require("graphics.engine.starwolf.script.enemy")

local w,h
local player
local enemies={}
local meteors={}

local enemyTimer=0
local meteorTimer=0

local mainMenu=true

local bgStart={0.05,0.07,0.2}
local bgEnd={0.0,0.03,0.15}

local imgPath="graphics/engine/starwolf/image/"
local leftImg=love.graphics.newImage(imgPath.."left.png")
local rightImg=love.graphics.newImage(imgPath.."right.png")
local attackImg=love.graphics.newImage(imgPath.."attack.png")
local hpImg=love.graphics.newImage(imgPath.."hp.png")
local emojis={}
local emojiKeys={"angry","shyness","happy","cooked"}
local emojiIndex=1
local activeEmoji=nil
local emojiTimer=0

local leftP=false
local rightP=false
local attackP=false

function love.load()
    w,h=love.graphics.getDimensions()
    player=Player:new(w/2-30,h*0.8)

    emojis.angry = love.graphics.newImage(imgPath.."angry.png")
    emojis.shyness = love.graphics.newImage(imgPath.."shyness.png")
    emojis.happy = love.graphics.newImage(imgPath.."happy.png")
    emojis.cooked = love.graphics.newImage(imgPath.."cooked.png")
end

local function spawnEnemy()
    table.insert(enemies,Enemy:new(math.random(40,w-40),-60))
end

local function spawnMeteor()
    table.insert(meteors,{
        x=math.random(0,w),
        y=math.random(-h,0),
        s=math.random(6,12),
        vx=math.random(-40,40),
        vy=math.random(120,260),
        rot=math.random()*math.pi,
        rotSpeed=(math.random()-0.5)*4
    })
end

function love.update(dt)
    if mainMenu then return end

    if leftP then player:move("left",dt) end
    if rightP then player:move("right",dt) end
    if attackP then player:shoot() end

    player:update(dt)

    enemyTimer=enemyTimer+dt
    if enemyTimer>1.2 then enemyTimer=0 spawnEnemy() end

    meteorTimer=meteorTimer+dt
    if meteorTimer>0.05 then meteorTimer=0 for i=1,3 do spawnMeteor() end end

    for i=#meteors,1,-1 do
        local m=meteors[i]
        m.x=m.x+m.vx*dt
        m.y=m.y+m.vy*dt
        m.rot = m.rot + m.rotSpeed*dt
        if m.y>h+20 then table.remove(meteors,i) end
    end

    for i=#enemies,1,-1 do
        local e=enemies[i]
        e:update(dt)
        for j=#player.bullets,1,-1 do
            local b=player.bullets[j]
            if b.x<e.x+e.w and b.x+b.w>e.x and b.y<e.y+e.h and b.y+b.h>e.y then
                e.hp = (e.hp or 1) - 1
                table.remove(player.bullets,j)
                if e.hp<=0 then table.remove(enemies,i) end
                break
            end
        end
        if e.y>h+60 then table.remove(enemies,i) end
    end

    if activeEmoji then
        emojiTimer=emojiTimer+dt
        if emojiTimer>5 then activeEmoji=nil emojiTimer=0 end
    end
end

function love.draw()
    for y=0,h,2 do
        local t=y/h
        love.graphics.setColor(
            bgStart[1]*(1-t)+bgEnd[1]*t,
            bgStart[2]*(1-t)+bgEnd[2]*t,
            bgStart[3]*(1-t)+bgEnd[3]*t
        )
        love.graphics.rectangle("fill",0,y,w,2)
    end
    love.graphics.setColor(1,1,1)

    if mainMenu then
        love.graphics.printf("THE DESTINY",0,h*0.42,w,"center")
        love.graphics.printf("Tap To Start",0,h*0.52,w,"center")
        love.graphics.printf("By CoolyDucks",0,h*0.92,w,"center")
        love.graphics.printf("Open-Source GitHub",0,h*0.96,w,"center")
        return
    end

    for _,m in ipairs(meteors) do
        love.graphics.push()
        love.graphics.translate(m.x+m.s/2,m.y+m.s/2)
        love.graphics.rotate(m.rot)
        love.graphics.setColor(0.6,0.6,0.6)
        love.graphics.rectangle("fill",-m.s/2,-m.s/2,m.s,m.s)
        love.graphics.pop()
    end
    love.graphics.setColor(1,1,1)

    player:draw()
    for _,e in ipairs(enemies) do e:draw() end

    for i=1,player.hp do
        love.graphics.draw(hpImg,20+(i-1)*42,18,0,0.04,0.04)
    end

    local yBtn=h*0.82
    local s=leftP and 0.055 or 0.06
    love.graphics.draw(leftImg,w*0.06,yBtn,0,s,s)
    s=rightP and 0.055 or 0.06
    love.graphics.draw(rightImg,w*0.16,yBtn,0,s,s)
    s=attackP and 0.085 or 0.09
    love.graphics.draw(attackImg,w*0.82,yBtn,0,s,s)

    love.graphics.rectangle("line",w*0.42,h*0.05,w*0.16,h*0.08)
    love.graphics.printf("EMOJI",w*0.42,h*0.075,w*0.16,"center")

    if activeEmoji then
        local scale=0.03+0.005*math.sin(love.timer.getTime()*10)
        love.graphics.draw(emojis[activeEmoji],player.x,player.y-56,0,scale,scale)
    end
end

function love.touchpressed(id,x,y)
    if mainMenu then mainMenu=false return end
    local yBtn=h*0.82
    if x>w*0.06 and x<w*0.12 and y>yBtn then leftP=true end
    if x>w*0.16 and x<w*0.22 and y>yBtn then rightP=true end
    if x>w*0.82 and y>yBtn then attackP=true end

    if x>w*0.42 and x<w*0.58 and y>h*0.05 and y<h*0.13 then
        emojiIndex=emojiIndex%#emojiKeys+1
        activeEmoji=emojiKeys[emojiIndex]
        emojiTimer=0
    end
end

function love.touchreleased()
    leftP=false
    rightP=false
    attackP=false
end
